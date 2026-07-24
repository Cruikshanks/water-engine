/**
 * Fetch the matching Bill Run
 * @module FetchBillRunService
 */

import BillRunModel from '../../models/bill-run.model.js'

/**
 * Fetch the matching Bill Run
 *
 * @param {string} billRunId - The bill run's UUID
 *
 * @returns {object} the matching bill run instance
 */
export default function fetchBillRunService(billRunId) {
  return BillRunModel.query().findById(billRunId)
}
