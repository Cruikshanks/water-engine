// We import dotenv directly in each config file to support unit tests that depend on this subset of config.
// Importing dotenv in multiple places has no effect on the app when running for real.
import 'dotenv/config'

export default {
  // NOTE: The value should be the same as `COOKIE_SECRET` on the legacy UI side
  password: process.env.COOKIE_SECRET,
  sessionName: process.env.SESSION_NAME
}
