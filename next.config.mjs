/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [process.env.NEXT_PUBLIC_BACKEND_DOMAIN],
  },
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        ({ request }, callback) => {
          if (/\.(test|spec)\.(js|ts|tsx)$/.test(request)) {
            return callback(null, "commonjs " + request);
          }
          callback();
        },
      ];
    }

    return config;
  },
};

export default nextConfig;
