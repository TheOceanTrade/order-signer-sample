import oceanClientWithSigner from './utility/oceanClient'
import { log, logError } from './utility/log'

(async () => {
  const ocean = await oceanClientWithSigner.getClient()
  const pairs = await ocean.marketData.tokenPairs()
  const myPair = pairs[0]
  log('Trading on pair : ' + myPair.baseToken.symbol + '/' + myPair.quoteToken.symbol)

  const data = {
    baseTokenAddress: myPair.baseToken.address,
    quoteTokenAddress: myPair.quoteToken.address,
    side: 'buy',
    orderAmount: '180000000000000000000',
    feeOption: 'feeInNative',
    price: '0.002834'
  }
  try {
    log(await ocean.trade.newLimitOrder(data))
  } catch (e) {
    logError(e)
  }
})()
