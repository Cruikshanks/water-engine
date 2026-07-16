'use strict'

function go (licenceId) {
  return {
    licenceId,
    holder: "John Doe",
    type: "Water Abstraction",
    status: "Active",
    expiryDate: "2026-12-31"
  }
}

module.exports = {
  go
}
