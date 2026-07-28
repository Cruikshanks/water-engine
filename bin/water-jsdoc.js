#!/usr/bin/env node

/**
 * Bin script to allow shared access to JSDoc from the apps. Means they don't have to install jsdoc as a dependency.
 *
 * When npm installs a package that has a bin entry, it creates a symlink in `node_modules/.bin/` pointing to that
 * script. So when water-engine is installed as a dependency, npm reads this in the `package.json`
 *
 * ```json
 * "bin": {
 *   "water-jsdoc": "./bin/water-jsdoc.js"
 * }
 * ```
 *
 * and creates `node_modules/.bin/water-jsdoc → node_modules/water-engine/bin/water-jsdoc.js`.
 *
 * When npm runs any script from a `package.json`, it temporarily prepends `node_modules/.bin` to `PATH`. So
 * `water-jsdoc` resolves to that symlink, which points to the engine's script — no different to how eslint or vitest
 * work in existing scripts.
 *
 * The jsdoc config is defined here as an object rather than a separate JSON file. All path-sensitive options
 * (`source.include`, `destination`, `readme`) are resolved against the calling app's directory at runtime. This means
 * the same settings (plugins, tags, templates) apply wherever `water-jsdoc` is invoked from, but the source files,
 * output destination, and readme all map to the caller's own project layout.
 * @module WaterJsdoc
 */

import { fileURLToPath } from 'node:url'
import { spawnSync } from 'child_process'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { unlinkSync, writeFileSync } from 'node:fs'

const callerDir = process.cwd()

// The path to the water-engine package is resolved relative to this file, so that we can find the jsdoc binary and
// plugins in the engine's node_modules. This is important because the apps don't have jsdoc installed, so we need to
// use the engine's copy.
const __dirname = dirname(fileURLToPath(import.meta.url))
const engineDir = join(__dirname, '..')
const jsdocBin = join(engineDir, 'node_modules/.bin/jsdoc')

const config = {
  opts: {
    encoding: 'utf8',
    destination: join(callerDir, 'docs'),
    pedantic: true,
    readme: join(callerDir, 'README.md'),
    recurse: true,
    verbose: true
  },
  plugins: ['plugins/markdown', 'plugins/underscore'],
  recurseDepth: 10,
  source: {
    include: [join(callerDir, 'src')],
    includePattern: '.js$',
    excludePattern: '(db/|docs/|node_modules/|test/)'
  },
  sourceType: 'module',
  tags: {
    allowUnknownTags: false,
    dictionaries: ['jsdoc']
  },
  templates: {
    cleverLinks: true,
    monospaceLinks: false
  }
}

// Write the config to a temporary file so we can pass it to jsdoc via `-c` without having to create a permanent file in
// the caller's project.
const tempConfigPath = join(tmpdir(), `water-jsdoc-${Date.now()}.json`)

writeFileSync(tempConfigPath, JSON.stringify(config))

// Spawn jsdoc as a child process, passing the temp config file and any other args from the caller. The stdio is
// inherited so that the output from jsdoc is printed to the console.
const args = ['-c', tempConfigPath, ...process.argv.slice(2)]
const result = spawnSync(jsdocBin, args, { stdio: 'inherit' })

// Clean up the temp config file after jsdoc has finished running. This is done after the spawnSync call so that the
// file is still available while jsdoc is running. If we deleted it before, jsdoc would fail to find the config file.
unlinkSync(tempConfigPath)

process.exit(result.status)
