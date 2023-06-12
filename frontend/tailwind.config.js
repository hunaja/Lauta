/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            gridTemplateColumns: {
                "auto-fit": "repeat(auto-fit, minmax(12em, 1fr))",
            },
        },
    },
    plugins: [],
};
