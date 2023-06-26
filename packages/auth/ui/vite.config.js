import rollupConfig from "./rollup.config";
import { visualizer } from "rollup-plugin-visualizer";

/** @type {import('vite').UserConfig} */
export default {
    base: "/auth/",
    plugins: [visualizer()],
    server: {
        port: 8081,
	host: "0.0.0.0",
        watch: true,
        hmr: false,
        proxy: {
            "^/auth/api": {
                target: process.env.API_URL
                    ? process.env.API_URL
                    : `http://127.0.0.1:${process.env.AUTH_APP_PORT || '8080'}/`,
                changeOrigin: true,
            },
        },
    },
    build: {
        minify: false,
        sourcemap: true,
        rollupOptions: {
            plugins: [
            ]
        }
    },
};
