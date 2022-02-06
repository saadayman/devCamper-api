const NodeGeocoder = require('node-geocoder')
const options = {
    provider: "mapquest",
    httpAdapter:'https',
  // Optional depending on the providers

  apiKey:"F23kD7TSMeVCO0LUuvHSot4BMTmHnix9", // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};
const geocoder = NodeGeocoder(options)
module.exports = geocoder