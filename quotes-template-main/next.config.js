/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        domains: ['lh3.googleusercontent.com'],
    },
    // Webpack configuration
    webpack: (config, { isServer, nextRuntime }) => {
        if (!isServer) {
          config.resolve.fallback = {
            ...config.resolve.fallback,
            util: require.resolve("util/"),
            "util/types": require.resolve("util/"),
          };
        }

        // Solution for Edge Runtime DNS module error for Webpack
        if (nextRuntime === "edge") {
            config.resolve.alias = {
                ...config.resolve.alias,
                'mongodb': false,
                '@auth/mongodb-adapter': false
            };
        }

        return config;
    },
    // Turbopack configuration
    turbopack: {
        resolveAlias: {
            // Polyfills for client-side
            ...(process.env.NEXT_RUNTIME !== 'edge' && {
                'util': 'util',
                'util/types': 'util'
            }),
            // Edge runtime aliases
            ...(process.env.NEXT_RUNTIME === 'edge' && {
                'mongodb': false,
                '@auth/mongodb-adapter': false
            })
        }
    }
}

module.exports = nextConfig
