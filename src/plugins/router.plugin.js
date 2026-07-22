import AssetRoutes from '../routes/assets.routes.js'
import RootRoutes from '../routes/root.routes.js'

const routes = [...RootRoutes, ...AssetRoutes]

export default {
  name: 'engine-router',
  register: (server, _options) => {
    server.route(routes)
  }
}
