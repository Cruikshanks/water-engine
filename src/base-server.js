import Cookie from '@hapi/cookie'
import Hapi from '@hapi/hapi'
import Inert from '@hapi/inert'

import AirbrakePlugin from './plugins/airbrake.plugin.js'
import HapiConfig from './config/hapi.config.js'
import HapiPinoPlugin from './plugins/hapi-pino.plugin.js'
import KeepYarAlivePlugin from './plugins/keep-yar-alive.plugin.js'
import PayloadCleanerPlugin from './plugins/payload-cleaner.plugin.js'
import RouterPlugin from './plugins/router.plugin.js'
import StopPlugin from './plugins/stop.plugin.js'
import ViewsPlugin from './plugins/views.plugin.js'
import YarPlugin from './plugins/yar.plugin.js'

/**
 * Prep an instance of Hapi server with all the base plugins registered
 *
 * @param {object} viewsConfig - The server config to apply when creating and preparing the Hapi server instance
 *
 * @returns {Promise<object>} The 'prepped' Hapi server instance
 */
export default async function baseServer(viewsConfig) {
  const server = Hapi.server(HapiConfig)

  await _registerPlugins(server, viewsConfig)

  return server
}

process.on('unhandledRejection', (err) => {
  console.error(err)
  process.exit(1)
})

async function _registerPlugins(server, viewsConfig) {
  // NOTE: This order matters to some plugins we register. Inserting into the order should be fine. But if you reorder
  // any existing plugin registration double-check you haven't broken anything!
  await server.register(StopPlugin)
  await server.register(Inert)
  await server.register(Cookie)
  await server.register(YarPlugin)
  await server.register(HapiPinoPlugin)
  await server.register(AirbrakePlugin)
  await server.register(PayloadCleanerPlugin)
  await server.register(ViewsPlugin(viewsConfig))
  await server.register(KeepYarAlivePlugin)
  await server.register(RouterPlugin)
}
