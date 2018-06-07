import util from 'util'

export const log = (message) => {
  console.log(util.inspect(message, false, null))
}

export const logError = (e) => {
  let logEverything = true
  if (e.response && e.response.data) {
    log(e.response.data)
    logEverything = false
  }
  if (e.config && e.config.data) {
    log(e.config.data)
    logEverything = false
  }
  if (logEverything) {
    log(e)
  }
}
