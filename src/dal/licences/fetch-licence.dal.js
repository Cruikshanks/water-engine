/**
 * Fetch the matching Licence
 * @module FetchLicenceDal
 */

import LicenceModel from '../../models/licence.model.js'

/**
 * Fetch the matching Licence
 *
 * @param {string} licenceId - The licence's UUID
 *
 * @returns {object} the matching licence instance
 */
export default function fetchLicenceDal(licenceId) {
  return LicenceModel.query().findById(licenceId)
}
