# The Ocean Node-less decentralized trading
This is meant to be an example of how to get up and running with The Ocean without having to sync an ethereum node or unlock an account.  There are several opportunities to improve security and this should only be used as a proof of concept.  

### The following environment variables are used:
- `WEB3_URL`  // Does not need an unlocked account.  Infura works well.
- `THE_OCEAN_API_KEY`   // Available from theocean.trade
- `THE_OCEAN_API_SECRET`  // Available from theocean.trade
- Ethereum Private keys in one of the following forms
 - Encrypted keystore file and passphrase (recommended)
   - `PATH_TO_KEYSTORE`
   - `KEYSTORE_PASSPHRASE`
 - Unencrypted Ethereum private key (not recommended)
   - `PRIVATE_KEY`
