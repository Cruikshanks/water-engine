/**
 * Fetch the matching Bill Run
 * @module FetchBillRunService
 */

/**
 * Fetch the matching Bill Run
 *
 * @param {string} billRunId - The bill run's UUID
 *
 * @returns {object} the matching bill run instance
 */
export default function fetchBillRunService(billRunId) {
  return {
    billRunId,
    reference: '100456',
    type: 'annual',
    financialYearEnd: '2027-03-31'
  }
}
