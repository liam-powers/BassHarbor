import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        fontFamily: {
            'body': ['Apercu'],
            'thick': ['Apercu Black'],
        },
        extend: {
            colors: {
                'pastel-red': '#FD5353',
                'pastel-red-dark': '#a63737',
                'easy-black': '#1A1A1A',
            },
        },
    },
    darkMode: "class",
};

export default config;
