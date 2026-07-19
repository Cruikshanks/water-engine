/**
 * Fetch the matching Licence
 * @module FetchLicenceService
 */

/**
 * Fetch the matching Licence
 * @param {string} licenceId - The licence's UUID
 *
 * @returns {object} the matching licence instance
 */
export default function fetchLicenceService(licenceId) {
  return {
    licenceId,
    holder: 'John Doe',
    type: 'Water Abstraction',
    status: 'Active',
    expiryDate: '2026-12-31'
  }
}
