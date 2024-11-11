import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: ["www.talkbass.com", "cdn.basschat.co.uk"],
        formats: ["image/webp"],
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
            return config;
        }

        config.resolve.fallback = {
            ...config.resolve.fallback,
            puppeteer: false,
            'puppeteer-extra': false,
            'puppeteer-extra-plugin-stealth': false,
            'p-limit': false,
        };

        return config;
    },
} satisfies NextConfig;

export default nextConfig;