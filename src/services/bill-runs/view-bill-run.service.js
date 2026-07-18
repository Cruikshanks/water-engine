export default function viewBillRunService (billRunId) {
  return {
    licenceId: billRunId,
    reference: "100456",
    type: "annual",
    financialYearEnd: "2027-03-31"
  }
}
