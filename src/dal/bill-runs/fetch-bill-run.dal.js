/**
 * Fetch the matching Bill Run
 * @module FetchBillRunDal
 */

import BillRunModel from '../../models/bill-run.model.js'

/**
 * Fetch the matching Bill Run
 *
 * @param {string} billRunId - The bill run's UUID
 *
 * @returns {object} the matching bill run instance
 */
export default function fetchBillRunDal(billRunId) {
  return BillRunModel.query().findById(billRunId)
}
