export default function fetchBillRunService (billRunId) {
  return {
    billRunId: billRunId,
    reference: "100456",
    type: "annual",
    financialYearEnd: "2027-03-31"
  }
}
