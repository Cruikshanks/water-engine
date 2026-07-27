/**
 * Config values used by our logger
 * @module LogConfig
 */

export default {
  // Credit to https://stackoverflow.com/a/323546/6117745 for how to handle
  // converting the env var to a boolean
  logAssetRequests: String(process.env.LOG_ASSET_REQUESTS) === 'true' || false,
  logInTest: String(process.env.LOG_IN_TEST) === 'true' || false
}
