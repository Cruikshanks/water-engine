/**
 * Fetch the matching Licence
 * @module FetchLicenceService
 */

import LicenceModel from '../../models/licence.model.js'

/**
 * Fetch the matching Licence
 *
 * @param {string} licenceId - The licence's UUID
 *
 * @returns {object} the matching licence instance
 */
export default function fetchLicenceService(licenceId) {
  return LicenceModel.query().findById(licenceId)
}
