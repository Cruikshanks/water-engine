export default function fetchLicenceService (licenceId) {
  return {
    licenceId,
    holder: "John Doe",
    type: "Water Abstraction",
    status: "Active",
    expiryDate: "2026-12-31"
  }
}
