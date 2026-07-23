import BaseServer from '../../src/base-server.js'

/**
 * Initialises the Hapi server without starting it
 *
 * > For test purposes only. Mimics what one of the apps would do
 *
 * @returns {Promise<object>} The initialised Hapi server instance
 */
export async function init() {
  const serverConfig = _serverConfig()

  const server = await BaseServer(serverConfig)

  await server.initialize()

  return server
}

/**
 * Starts the Hapi server and begins accepting connections
 *
 * > For test purposes only. Mimics what one of the apps would do
 *
 * @returns {Promise<object>} The running Hapi server instance
 */
export async function start() {
  const server = await init()

  await server.start()

  return server
}

process.on('unhandledRejection', (err) => {
  console.error(err)
  process.exit(1)
})

function _serverConfig() {
  return {
    hapi: {
      port: 3000,
      // The router section controls how incoming request URIs are matched against the routing table. In our AWS
      // environments we see trailing slashes added to the end of paths so this deals with that issue. We also don't want
      // client systems having to worry about what case they use for the endpoint when making a request.
      router: {
        isCaseSensitive: false,
        stripTrailingSlash: true
      }
    },
    vision: {
      // Only enable caching of templates if we are running in production
      isCached: false,
      // the root file path used to resolve and load the templates identified when calling h.view()
      path: 'views',
      // The base path used as prefix for `path:`. It will dynamically resolve to the directory containing this file
      // (…/test/support/test-server.js) so that the `path:` is relative to this file.
      relativeTo: import.meta.dirname
    },
    yar: {
      password: 'supercalifragilisticexpialidocious',
      sessionName: 'engine-test'
    }
  }
}
