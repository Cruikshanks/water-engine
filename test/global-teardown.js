/**
 * Vitest global teardown — runs once in the main process after the full test suite
 * @module GlobalTeardown
 */

/**
 * Closes the database connection after all tests have run
 *
 * @returns {Promise} resolves when the database connection has been closed
 */
export default async function globalTeardown() {
  // Does nothing - yet!
}
