import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    externalDir: true,
  },
  outputFileTracingRoot: path.join(__dirname, ".."),
};

module.exports = nextConfig;
