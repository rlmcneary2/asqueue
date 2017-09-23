"use strict";


const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const path = require("path");
const webpack = require("webpack");


const _SOURCE_DIR = "src";
const _OUTPUT_DIR = "dist";


/**
 * @module
 * This is a webpack2 configuration file.
 */
module.exports = {
    devServer: {
        contentBase: path.resolve(__dirname, _OUTPUT_DIR),
        inline: true
    },
    // devtool: "source-maps",
    entry: path.resolve("./index.ts"),
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: "awesome-typescript-loader",
                        options: {
                            useBabel: true,
                            useCache: false,
                            babelOptions: {
                                plugins: [["transform-runtime", { helpers: false, moduleName: "babel-runtime" }]],
                                presets: [["es2015", { modules: false }], "es2016", "es2017"],
                                retainLines: true,
                            }
                        }
                    }
                ]
            }
        ]
    },
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, _OUTPUT_DIR)
    },
    plugins: [
        new webpack.DefinePlugin({ "process.env": { NODE_ENV: process.env.NODE_ENV } }),
        new webpack.LoaderOptionsPlugin({ debug: true })/*,
        new BundleAnalyzerPlugin()*/
    ],
    resolve: {
        extensions: [".js", ".ts"] // Must include .js here to resolve files in node_modules.
    },
    target: "web"
};
