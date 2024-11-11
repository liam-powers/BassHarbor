import type { NextConfig } from 'next';

const imageDomains = ["www.talkbass.com", "cdn.basschat.co.uk"];

const nextConfig: NextConfig = {
    serverExternalPackages: [
        "puppeteer-extra",
        "puppeteer-extra-plugin-stealth",
        "puppeteer-extra-plugin-adblocker",
        "puppeteer-extra-plugin-block-resources",
        "turndown",
    ],
    images: {
        remotePatterns: imageDomains.map((domain) => ({
            protocol: 'https',
            hostname: domain,
        })),
    },
};

export default nextConfig;