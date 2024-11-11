const imageDomains = ["www.talkbass.com", "cdn.basschat.co.uk"];

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals = config.externals || [];
        config.externals.push(
            "puppeteer-extra",
            "puppeteer-extra-plugin-stealth",
            "puppeteer-extra-plugin-adblocker",
            "puppeteer-extra-plugin-block-resources",
            "turndown"
        );

        return config;
    },
    // serverExternalPackages: [
    //     "next/dist/client/components/static-generation-async-storage.external.js"
    // ],
    images: {
        remotePatterns: imageDomains.map((domain) => ({
            protocol: 'https',
            hostname: domain,
        })),
    },
};

module.exports = nextConfig;