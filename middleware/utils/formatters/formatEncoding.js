
const formatEncoding = (deviceClass) => {
    switch (deviceClass) {
        case "Home":
          return "large-home-entertainment-class-device";
        case "Wearables":
          return "wearable-class-device";
        case "Headphones":
          return "headphone-class-device";
        case "Small Speaker":
          return "small-bluetooth-speaker-class-device";
        case "Medium Speaker":
          return "medium-bluetooth-speaker-class-device";
        case "Car":
          return "large-automotive-class-device";
        case "Handset Devices":
          return "handset-class-device";
        case "Telephony":
          return "telephony-class-application";
        default:
          return "Unknown";
      }
}

module.exports = formatEncoding;