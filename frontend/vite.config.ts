/* eslint-disable import/no-extraneous-dependencies */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:3001",
                changeOrigin: true,
            },
            "/files": {
                target: "http://localhost:9000",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/files/, ""),
            },
        },
    },
    css: {
        postcss: {
            plugins: [require("tailwindcss"), require("autoprefixer")],
        },
    },
});
