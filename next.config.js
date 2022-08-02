/** @type {import("next").NextConfig} */

module.exports = {
   reactStrictMode: true,
   images: { domains: ["public-web3app.s3.eu-north-1.amazonaws.com"] },
   // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
   redirects() {
      return [
         process.env.MAINTENANCE_MODE === "1"
            ? { source: "/", destination: "/maintenance", permanent: false }
            : { source: "/maintenance", destination: "/", permanent: false },
      ].filter(Boolean)
   }
}
