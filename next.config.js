/** @type {import("next").NextConfig} */

const withPreact = require("next-plugin-preact")  // eslint-disable-line @typescript-eslint/no-var-requires


module.exports = withPreact({ reactStrictMode: true })
