/** @type {import("next").NextConfig} */

const withBundleAnalyzer = require("@next/bundle-analyzer")( // eslint-disable-line @typescript-eslint/no-var-requires
   { enabled: process.env.ANALYZE === "true" })

module.exports = withBundleAnalyzer({
   reactStrictMode: true,
   webpack: (config, { // eslint-disable-line @typescript-eslint/explicit-function-return-type
      dev,
      isServer
   }) => {
      if (!dev && !isServer) {
         Object.assign(config.resolve.alias, {
            react: "preact/compat",
            "react-dom/test-utils": "preact/test-utils",
            "react-dom": "preact/compat"
         })
      }
      return config
   }
})
