import { nodeResolve } from "@rollup/plugin-node-resolve";
import css from "rollup-plugin-import-css";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import dotenv from "dotenv";
import path from 'path';
dotenv.config({path: path.resolve(process.cwd(),'..','..','.env')});

export default {
    input: "src/index.js",
    output: {
        file: "index.js",
        format: "es",
        sourcemap: "inline",
    },
    watch: {
        // exclude: "node_modules/**",
        // Maybe this is better?
        include: ["./src/**", "../shared/**"],
        skipWrite: true,
    },
    plugins: [
        nodeResolve({ jsnext: true, preferBuiltins: true, browser: true }),
        replace({
            preventAssignment: true,
            values: {
                DIRECTUS_URL: (process.env.NODE_ENV == 'development' && process.env.PUBLIC_URL) ? JSON.stringify(process.env.PUBLIC_URL) : JSON.stringify('/'),
            },
        }),
        json(),
        commonjs(),
        css(),
    ],
};
