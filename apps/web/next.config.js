const withTM = require("next-transpile-modules")(["configs", "sdk"]);

module.exports = withTM({
  reactStrictMode: true
});
