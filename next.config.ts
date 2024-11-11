import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: ["www.talkbass.com", "cdn.basschat.co.uk"],
        formats: ["image/webp"],
    },
};

export default nextConfig;
