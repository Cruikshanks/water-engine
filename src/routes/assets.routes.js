export default [
  {
    method: 'GET',
    path: '/assets/all.js',
    options: {
      handler: {
        file: 'node_modules/water-engine/node_modules/govuk-frontend/govuk/all.js'
      },
      app: {
        plainOutput: true
      },
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/assets/{path*}',
    options: {
      handler: {
        directory: {
          path: [
            'src/public/static',
            'src/public/images',
            'src/public/build',
            'node_modules/water-engine/node_modules/govuk-frontend/govuk/assets'
          ]
        }
      },
      app: {
        plainOutput: true
      },
      auth: false
    }
  }
]
