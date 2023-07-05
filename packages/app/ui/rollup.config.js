import { nodeResolve } from "@rollup/plugin-node-resolve";
import css from "rollup-plugin-import-css";
import replace from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";

export default {
    input: "src/index.js",
    output: {
        file: "index.js",
        format: "es",
        sourcemap: "inline",
    },
    watch: {
        include: ["./src/**"],
        skipWrite: true,
    },
    plugins: [
        nodeResolve({ jsnext: true, preferBuiltins: true, browser: true }),
        json(),
        css(),
        replace({
            values: {
                VERSION: "0",
                CLIENT_ID: process.env.CLIENT_ID,
                NODE_ENV: process.env.NODE_ENV,
                APP_NAME: "auth"
            }
        })
    ],
};
