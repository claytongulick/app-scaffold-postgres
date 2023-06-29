import { visualizer } from "rollup-plugin-visualizer";
import replace from "@rollup/plugin-replace";

/** @type {import('vite').UserConfig} */
export default {
    base: "/auth/",
    plugins: [
        visualizer(),
        /*
        replace({
            preventAssignment: true,
            values: {
                VERSION: "0",
                CLIENT_ID: JSON.stringify(process.env.CLIENT_ID),
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'local'),
                APP_NAME: JSON.stringify("auth")
            }
        })
        */
    ],
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
    },
};
