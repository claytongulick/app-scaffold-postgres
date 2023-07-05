import { visualizer } from "rollup-plugin-visualizer";
import replace from "@rollup/plugin-replace";
import '../../../load-env.js';

/** @type {import('vite').UserConfig} */
export default {
    base: "/app/",
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
        port: 8091,
	host: "0.0.0.0",
        watch: true,
        hmr: false,
        proxy: {
            "^/app/api": {
                target: `http://127.0.0.1:${process.env.APP_HTTP_PORT}/`,
                changeOrigin: true,
            },
            "^/auth/api": {
                target: `http://127.0.0.1:${process.env.AUTH_HTTP_PORT}/`,
                changeOrigin: true,
            },
        },
    },
    build: {
        minify: false,
        sourcemap: true,
    },
};
