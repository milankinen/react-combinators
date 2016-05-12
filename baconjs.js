var createExports = require("./lib/createExports").default
var bindings = require("./lib/bindings/baconjs").default

module.exports = createExports(bindings)
