/** @type {import("next").NextConfig} */
module.exports = {
   reactStrictMode: true,
   webpack: (config, { dev, isServer }) => { // eslint-disable-line @typescript-eslint/explicit-function-return-type
      if (!dev && !isServer) {
         Object.assign(config.resolve.alias, {
            react: "preact/compat",
            "react-dom/test-utils": "preact/test-utils",
            "react-dom": "preact/compat"
         })
      }
      return config
   }
}
