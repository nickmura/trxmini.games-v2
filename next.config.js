/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SOCKET_URL:
      // process.env.NODE_ENV === "development"
      //   ? "http://localhost:5000"
      //   : "https://squid-app-cwhr6.ondigitalocean.app",
      "https://squid-app-cwhr6.ondigitalocean.app",
    BACKEND_API_URL_BASE:
      // process.env.NODE_ENV === "development"
      //   ? "http://localhost:5000"
      //   : "https://squid-app-cwhr6.ondigitalocean.app",
      "https://squid-app-cwhr6.ondigitalocean.app",
  },
};

module.exports = nextConfig;
