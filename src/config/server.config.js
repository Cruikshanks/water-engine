// We import dotenv directly in each config file to support unit tests that depend on this subset of config.
// Importing dotenv in multiple places has no effect on the app when running for real.
import 'dotenv/config'

export default {
  domains: {
    external: process.env.EXTERNAL_DOMAIN,
    internal: process.env.INTERNAL_DOMAIN
  },
  environment: process.env.NODE_ENV || 'development',
  // Note - Why lowercase? It's just the convention for http_proxy, https_proxy
  // and no_proxy. ¯\_(ツ)_/¯ https://unix.stackexchange.com/a/212972
  httpProxy: process.env.http_proxy
}
