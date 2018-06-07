import { log } from './log'
import createOcean from 'the-ocean'
import SignerProvider from 'ethjs-provider-signer'
import { sign } from 'ethjs-signer'
import { addHexPrefix, privateToAddress, ecsign, hashPersonalMessage, toBuffer, toRpcSig } from 'ethereumjs-util'
import config from '../config'
import Web3EthAccounts from 'web3-eth-accounts'

const getPrivateKey = () => {
  const web3Account = new Web3EthAccounts(process.env.WEB3_URL)
  if (process.env.PRIVATE_KEY) {
    return process.env.PRIVATE_KEY
  } else if (process.env.PATH_TO_KEYSTORE && process.env.KEYSTORE_PASSPHRASE) {
    return web3Account.decrypt(require(process.env.PATH_TO_KEYSTORE), process.env.KEYSTORE_PASSPHRASE).privateKey
  }
}

const signTransaction = (rawTx, cb) => {
  const privateKey = getPrivateKey()

  if (!privateKey) {
    log('No Private Key')
    cb(new Error('Private key missing!'), null)
  } else {
    log('Signing with Private Key')
    cb(null, sign(rawTx, privateKey))
  }
}

// We replace sendAsync to allow for use with eth_sign
const createProvider = (url, options) => {
  log(`Using ${url} for rpc calls.`)
  const provider = new SignerProvider(url, options)
  let privateKey = getPrivateKey()

  // This method needs to be overwritten to sign messages that aren't transactions
  provider.sendAsync = function (payload, callback) {
    if (payload.method === 'eth_sign') {
      const message = payload.params[1]
      const signature = ecsign(hashPersonalMessage(toBuffer(message)), toBuffer(privateKey))
      const result = {
        jsonrpc: '2.0',
        id: 1,
        result: toRpcSig(signature.v, signature.r, signature.s)
      }
      callback(null, result)
    }
    return SignerProvider.prototype.sendAsync.bind(this)(payload, callback)
  }
  return provider
}

class TheOceanClientWithSigner {
  constructor () {
    this.isReady = this.init()
  }

  async init () {
    const accounts = (cb) => cb(null, [addHexPrefix(privateToAddress(getPrivateKey()).toString('hex'))])
    const provider = createProvider(process.env.WEB3_URL, { accounts, signTransaction })
    try {
      this.client = await createOcean({
        api: {
          key: process.env.THE_OCEAN_API_KEY,
          secret: process.env.THE_OCEAN_API_SECRET,
          baseURL: config.apiURL
        },
        websockets: config.websocketsURL,
        web3Provider: provider
      })
    } catch (e) {
      log(e)
    }
  }

  async getClient () {
    await this.isReady
    return this.client
  }
}

export default new TheOceanClientWithSigner()
