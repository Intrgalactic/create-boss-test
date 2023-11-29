
function convertToBoolean(variable) {
    if (variable === "No" || variable === "Disable") {
      return false;
    }
    else {
      return true;
    }
  }

module.exports = convertToBoolean;