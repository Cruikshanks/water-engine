/**
 * Our views plugin which serves views using nunjucks and govuk-frontend.
 *
 * The bulk of this is taken from https://github.com/DEFRA/hapi-web-boilerplate and tweaked to fit how we organise our
 * code. For now we have removed Google Analytics (which would have been added to the `context` option) as we can
 * integrate that at a later date.
 *
 * @module ViewsPlugin
 */

import Nunjucks from 'nunjucks'
import Vision from '@hapi/vision'
import path from 'node:path'

/**
 * The rendering function for the view engine
 *
 * When we register the Vision plugin we are required to populate `options:` (see
 * {@link https://hapi.dev/module/vision/api/?v=7.0.1#options options}). For each `engine:` we register (in our case
 * just Nunjucks) we must set the `compile:` property to a function which in turn returns a function that will be called
 * when a view is to be rendered, for example, when `h.view()` is called in a controller.
 *
 * We know, it's confusing! This is why we've broken it out here rather than follow the
 * {@link https://hapi.dev/module/vision/api/?v=7.0.1#nunjucks nunjucks example} which does it all inline.
 *
 * We believe it's done in this way to take advantage of a
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures closure}. Before rendering a template
 * Nunjucks needs to compile it. So, we can generate the compiled template using the args passed to this function.
 *
 * Using a closure, we can refer to the compiled template we create here in the function we're returning, even though
 * that function will be called somewhere else entirely!
 *
 * Tl;DR; The object we pass to Vision `compile:` must be a function that returns a function :-)
 *
 * @param {string} template - The content of the template
 * @param {object} options - Vision's `config.compileOptions` property which we assign the Nunjucks Environment instance
 * to in `prepare()` below
 *
 * @returns {function} A function that will be called when a view is to be rendered
 */
function compile(template, options) {
  const compiledTemplate = Nunjucks.compile(template, options.environment)

  return (renderContext) => {
    return compiledTemplate.render(renderContext)
  }
}

/**
 * Build global context used with _all_ templates
 *
 * According to the Vision docs the global context option can be either an object or a function that takes the `request`
 * as its only argument and returns a context object.
 *
 * When rendering views, the global context will be merged with any context object specified on the handler or using
 * `h.view()`. When multiple context objects are used, values from the global context always have lowest precedence.
 *
 * Expanding that last point what it means is when we call `h.view('bills/view.njk', { ...myContext })` in a controller
 * Vision will combine the 'context' (data) we pass in with the `params`, `payload`, `query` and `pre` values from the
 * `request` plus the output of this function and pass that through to the template. Nice!
 *
 * > Credit to https://www.solarwinter.net/hapi-vision-and-who-am-i/ for highlighting we could do this
 *
 * @param {object} request - Instance of a Hapi {@link https://hapi.dev/api/?v=21.3.2#request Request}
 *
 * @returns {object} the global context for all templates
 */
function context(request) {
  return {
    // `assetPath` is referred to in layout.njk as the path to get static assets like client-side javascript. This is
    // handled by the `assets.routes.js` routes in water-engine.
    assetPath: '/assets',
    // this is the url of where the request came from should a template need to know. Avoid using it for back links
    // though, as it lies!
    referrer: request.info.referrer
  }
}

/**
 * Initialises additional engine state
 *
 * That summary description and the ones for the params is taken directly from the
 * {@link https://hapi.dev/module/vision/api/?v=7.0.1#options Vision docs}.
 *
 * Essentially, Vision is 'engine agnostic'. It is intended to work with lots of view engines. Some of them, like
 * Nunjucks, require or can be configured. If `prepare:` is in the plugin options Vision will call it as part of
 * its initialisation so you can configure your chosen view engine.
 *
 * @param {*} config - The engine configuration object allowing updates to be made. This is useful for engines like
 * Nunjucks that rely on additional state for rendering
 * @param {*} next - Has the signature `function(err)`
 *
 * @returns the result of calling `next()`
 */
function prepare(config, next) {
  // Tell Nunjucks the paths to where your templates live. We _think_ Nunjucks searches in order of the paths provided.
  // So, search our templates first before searching in the govuk-frontend package for a template.
  //
  // We resolve all paths relative to this plugin file rather than using bare relative paths. Bare relative paths
  // would resolve against the consuming app's CWD, but these are water-engine's own dependencies so they live
  // alongside this file. import.meta.dirname gives us the real path regardless of symlinks, so this works whether
  // water-engine is installed as a git dependency (nested under node_modules/water-engine/) or npm-linked.
  //
  // govukFrontendPath:  …/water-engine/node_modules/govuk-frontend/
  //   → templates imported as e.g. "govuk/components/summary-list/macro.njk"
  //
  // waterEngineParentPath: parent directory of water-engine itself
  //   - git dep:  water-back-office/node_modules/   (contains water-engine/)
  //   - npm link: workspace parent dir              (contains water-engine/)
  //   → templates imported as e.g. "water-engine/views/macros/page-heading.njk"
  const govukFrontendPath = path.resolve(import.meta.dirname, '../../node_modules/govuk-frontend/')
  const waterEngineParentPath = path.resolve(import.meta.dirname, '../../..')
  const paths = [path.join(config.relativeTo, config.path), waterEngineParentPath, govukFrontendPath]

  // configure() returns an instance of Nunjucks Environment class (see
  // https://mozilla.github.io/nunjucks/api.html#environment) which is the central object for handling templates.
  // This gets assigned to Vision's compileOptions which is passed into `compile()` above as `options`.
  const environment = Nunjucks.configure(paths)

  config.compileOptions.environment = environment

  return next()
}

/**
 * Factory function to build the Vision plugin
 *
 * This differs from our other plugins that return an object because need to pass in config to be applied to the object
 * we're returning. This is because the apps need to tell us where their views are located so we can configure Vision
 * and Nunjucks to find them.
 *
 * @param {object} config - Object containing `isCached`, `path` and `relativeTo` properties to configure Vision and
 * Nunjucks
 *
 * @returns {object} The Vision plugin object
 */
export default function ViewsPlugin(config) {
  const { isCached, path, relativeTo } = config
  return {
    plugin: Vision,
    options: {
      engines: {
        // The 'engine' is the file extension this applies to; in this case, .njk
        njk: {
          compile,
          prepare
        }
      },
      context,
      // the root file path used to resolve and load the templates identified when calling h.view()
      path,
      // a base path used as prefix for `path:`
      relativeTo,
      // Whether to enable caching of templates (typically only enabled in production)
      isCached
    }
  }
}
