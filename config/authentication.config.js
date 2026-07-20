/**
 * Config values used for cookie authentication
 * @module AuthenticationConfig
 */

export default {
  password: process.env.COOKIE_SECRET,
  sessionName: process.env.SESSION_NAME
}
