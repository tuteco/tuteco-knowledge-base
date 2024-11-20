import colors from "tailwindcss/colors";

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        colors: {
            transparent: colors.transparent,
            neutral: colors.neutral,
            black: colors.black,
            white: colors.white,
            red: colors.red,
            amber: colors.amber,
            green: colors.green,
            primary: {
                100: "hsl(var(--color-primary-100))",
                200: "hsl(var(--color-primary-200))",
                300: "hsl(var(--color-primary-300))",
                400: "hsl(var(--color-primary-400))",
            },
        },
    },
    plugins: [],
};