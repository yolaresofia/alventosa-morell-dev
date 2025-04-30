const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    SC_DISABLE_SPEEDY: "false",
  },
  images: {
    domains: ["cdn.sanity.io"],
  },
};

export default nextConfig;