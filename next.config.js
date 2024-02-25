/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SOCKET_URL: "http://localhost:5000",
    BACKEND_API_URL_BASE: "http://localhost:5000",
  },
};

module.exports = nextConfig;
