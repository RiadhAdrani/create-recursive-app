#!/usr/bin/env node
import inquirer from "inquirer";
import fs from "fs";
import { execSync } from "child_process";
import cypher from "@riadh-adrani/cypher-writer";
import prettier from "prettier";
import { isBlank } from "@riadh-adrani/utility-js";

const { mprt, xprt, fn } = cypher;

function writeIntoFile(text, filepath, format = true) {
    try {
        fs.writeFileSync(filepath, format ? prettier.format(text, { filepath }) : text);
    } catch (e) {
        console.log(e);
        console.log("\x1b[33m", `Something went wrong while writing into '${filepath}'`);
        console.log("\x1b[0m");
    }
}

const runCommand = (command) => {
    try {
        execSync(`${command}`, { stdio: "inherit" });
    } catch (e) {
        console.error(`failed to execute ${command}`, e);
        return false;
    }

    return true;
};

inquirer
    .prompt([
        {
            type: "list",
            name: "lang",
            message: "Choose your preferred language",
            choices: [
                { name: "Javascript", value: "js", checked: true },
                { name: "Typescript", value: "ts" },
            ],
        },
    ])
    .then((answers) => {
        const options = {
            ts: answers.lang === "ts",
        };

        let repo;

        if (isBlank(process.argv[2])) {
            console.log("Project name is empty ! Please try again.");
            return;
        } else {
            repo = process.argv[2];
        }

        const dir = (path) => `${repo}/${path}`;

        runCommand(`mkdir ${repo}`);
        runCommand(`mkdir ${repo}/public`);
        runCommand(`mkdir ${repo}/src`);
        runCommand(`mkdir ${repo}/src/app`);

        const { common, dev, prod } = webpack(options);

        writeIntoFile(tsconfig(), dir("tsconfig.json"));
        writeIntoFile(packageJson(repo, options), dir("package.json"));
        writeIntoFile(common, dir("webpack.common.js"));
        writeIntoFile(dev, dir("webpack.dev.js"));
        writeIntoFile(prod, dir("webpack.prod.js"));
        writeIntoFile(html(repo), dir("/public/index.html"));

        writeIntoFile(indexJS(), dir("/src/index.js"));
        writeIntoFile(indexD(), dir("/src/index.d.ts"));

        writeIntoFile(template(repo), dir(options.ts ? "src/app/app.ts" : "src/app/app.js"));

        const deps = ["@riadh-adrani/recursive-web"];
        const devDeps = [
            "clean-webpack-plugin",
            "css-loader",
            "file-loader",
            "html-loader",
            "html-webpack-plugin",
            "node-sass",
            "sass",
            "sass-loader",
            "style-loader",
            "terser-webpack-plugin",
            "ts-loader",
            "typescript",
            "webpack",
            "webpack-cli",
            "webpack-dev-server",
            "webpack-merge",
        ];

        runCommand(`cd ${repo} && npm install ${deps.join(" ")}`);
        runCommand(`cd ${repo} && npm install --save-dev ${devDeps.join(" ")}`);

        writeIntoFile(gitignore(), dir(".gitignore"), false);
        runCommand(`cd ${repo} && git init`);

        console.log("Almost there !");

        console.log("\x1b[32m");
        console.log(`cd ${repo} && npm start`);
        console.log("\x1b[0m");
        console.log("Happy coding !");
    });

function template(repo) {
    return [
        mprt(
            ["A", "Button", "CenteredColumn", "H1", "P", "Spacer"],
            "@riadh-adrani/recursive-web/html"
        ),
        mprt(["setStyle", "setState"], ".."),
        "",
        fn({
            isArrowFunction: true,
            name: "App",
            body: [
                `
                const [count,setCount] = setState("counter", 0);
                setStyle({
                    selectors: {
                        "body,html": { margin: 0, fontFamily: "system-ui", fontSize: "large" },
                        button: { fontSize: "x-large" },
                    },
                })`,
                `return CenteredColumn({
                    style: {
                        inline: {
                            padding: ["20px", "10px"],
                            height: "100vh",
                            boxSizing: "border-box",
                        },
                    },
                    children: [
                        H1({ children: "Hello ${repo}!"}),
                        P({
                            children: [
                                "This is a template, to get started, visit ",
                                A({
                                    children: "The official website",
                                    href: "https://riadhadrani.github.io/recursive-docs",
                                    target: "_blank",
                                }),
                            ],
                        }),
                        Spacer({
                            height: "20px",
                        }),
                        Button({
                            children: \`You clicked me \${count} \${count > 1 ? "times" : "time"}\`,
                            onClick: () => setCount(count + 1),
                        }),
                    ],
                })`,
            ],
        }),
        xprt("App", true),
    ].join("\n");
}

function indexJS() {
    return `import {
        RecursiveWebApp,
        createComponentStyle,
        importFile,
        mergeComponentStyles,
    } from "@riadh-adrani/recursive-web";
    import { createElement, createRoute } from "@riadh-adrani/recursive-web/use";
    
    import app from "./app/app";
    
    const webApp = new RecursiveWebApp({
        root: document.body,
        app,
        base: "",
        scopedStyle: false,
        scrollCorrection: false,
    });
    
    export { importFile, mergeComponentStyles };
    export { createComponentStyle, createElement, createRoute };
    
    /**
     * Calculate the parameters of the current path and returns them as a key-value object.
     *  @throws an error when the router is not initialized.
     */
    export function getParams() {
        return webApp.getParams();
    }
    /**
     * Change the current route and trigger an update if needed.
     * @throws an error when the router is not initialized.
     * @param {string} path Destination path.
     */
    export function goTo(path) {
        return webApp.goTo(path);
    }
    /**
     * Used to inject a route component into the elements tree.
     * Could be used recursively within nested routes to render the appropriate components
     *  @throws an error when the router is not initialized.
     * * @returns The current route fragment element.
     */
    export function renderRoute() {
        return webApp.renderRoute();
    }
    /**
     *  Retrieve the current route as string.
     * @throws an error when the router is not initialized.
     */
    export function getRoute() {
        return webApp.getRoute();
    }
    /**
     * return the currently targeted anchor
     *  @throws an error when the router is not initialized.
     */
    export function getAnchor() {
        return webApp.getAnchor();
    }
    /**
     * Return the base of the application.
     * @throws an error when the router is not initialized.
     * @returns {string} Base as string.
     */
    export function getBase() {
        return webApp.getBase();
    }
    /**
     * Retrieve an existing stateful object from the \`state\` store if it exists.
     * @param {string} key identifier
     * @throw an error if the state does not exist.
     * @returns {StateArray} state as an array.
     */
    export function getState(key) {
        return webApp.getState(key);
    }
    /**
     * Retrieve an existing stateful object from the \`cache\` store if it exists.
     * @param {string} key identifier
     * @throw an error if the state does not exist.
     * @returns {StateArray} state as an array.
     */
    export function getCache(key) {
        return webApp.getCache(key);
    }
    /**
     * Retrieve an existing element from the \`reference\` store, or the default value.
     * Use the \`hooks.onRef\` hook and return a string from the function to initialize a new reference.
     */
    export function getRef(key, defaultValue) {
        return webApp.getRef(key, defaultValue);
    }
    /**
     * Create and save a stateful object in the \`state\` store within the global \`StateStore\`.
     * Objects created by this method are deleted when they are not used or called in a rendering iteration
     * @param {string} key unique identifier of the state within its store.
     * @param {any} value initial value
     * @param {Function} onInit a function that will execute when the state is initialized.
     * If the return value of this function is a function itself,
     * it will be executed whe the state is destroyed.
     * @param {Function} onRemoved a function that will execute when the state has been destroyed.
     * @returns {StateArray} state as an Array
     */
    export function setState(key, value, onInit, onRemoved) {
        return webApp.setState(key, value, onInit, onRemoved);
    }
    /**
     * Create and save a stateful object in the \`cache\` store within the global \`StateStore\`.
     * Objects created by this method are not deleted when they are not used,
     * unless the number of cached object exceed the maximum allocated size which is by default \`1000\`.
     * Older states will be deleted first.
     * @param {string} key unique identifier of the state within its store.
     * @param {any} value initial value
     * @param {Function} onInit a function that will execute when the state is initialized.
     * If the return value of this function is a function itself,
     * it will be executed whe the state is destroyed.
     * @param {Function} onRemoved a function that will execute when the state has been destroyed.
     * @returns {StateArray} state as an array.
     */
    export function setCache(key, value, onInit, onRemoved) {
        return webApp.setCache(key, value, onInit, onRemoved);
    }
    /**
     * Execute an effect.
     * @param {string} key identifier.
     * @param {Function} callback callback to be executed.
     * @param {Array} dependencies effect dependencies that will decide if the effect should be called again.
     */
    export function setEffect(key, dependencies, callback) {
        return webApp.setEffect(key, dependencies, callback);
    }
    /**
     * Batch update made within the callback.
     * Used generally to state update after an asynchronous call.
     * \`The callback function should not be an asynchronous function.\`
     */
    export function updateOn(callback) {
        webApp.updateOn(callback);
    }
    /**
     * Add a style sheet that will be evaluated every time the app rerender.
     * Can be used multiple times, at any depth within the tree of components.
     *  @param style style sheet declaration.
     */
    export function setStyle(style) {
        webApp.setStyle(style);
    }
    
    webApp.render();
    `;
}

function indexD() {
    return [
        `import { ObjectOf } from "@riadh-adrani/recursive-web/types/util";
         import { StateArray, BaseElement } from "@riadh-adrani/recursive/lib";`,
        "",
        `export { importFile, mergeComponentStyles, createComponentStyle } from "@riadh-adrani/recursive-web"
        export {  createElement, createRoute } from "@riadh-adrani/recursive"`,
        "",
        `/**
         * Calculate the parameters of the current path and returns them as a key-value object.
         *  @throws an error when the router is not initialized.
         */
        export function getParams(): ObjectOf<string>;`,
        `/**
        * Change the current route and trigger an update if needed.
        * @throws an error when the router is not initialized.
        * @param {string} path Destination path.
        */
       export function goTo(path: string): void;`,
        `/**
        * Used to inject a route component into the elements tree.
        * Could be used recursively within nested routes to render the appropriate components
        *  @throws an error when the router is not initialized.
        * @returns The current route fragment element.
        */
       export function renderRoute(): BaseElement;`,
        `/**
       *  Retrieve the current route as string.
       * @throws an error when the router is not initialized.
       */
      export function getRoute(): string;`,
        `/**
      * return the currently targeted anchor
      *  @throws an error when the router is not initialized.
      */
     export function getAnchor(): string;`,
        `/**
     * Return the base of the application.
     * @throws an error when the router is not initialized.
     * @returns {string} Base as string.
     */
    export function getBase(): string;`,
        `/**
    * Retrieve an existing stateful object from the \`state\` store if it exists.
    * @param {string} key identifier
    * @throw an error if the state does not exist.
    * @returns {StateArray} state as an array.
    */
   export function getState<T = any>(key: string): StateArray<T>;`,
        `/**
   * Retrieve an existing stateful object from the \`cache\` store if it exists.
   * @param {string} key identifier
   * @throw an error if the state does not exist.
   * @returns {StateArray} state as an array.
   */`,
        `export function getCache<T = any>(key: string): StateArray<T>;
   /**
    * Retrieve an existing element from the \`reference\` store, or the default value.
    * Use the \`hooks.onRef\` hook and return a string from the function to initialize a new reference.
    */`,
        `export function getRef<T = HTMLElement>(key: string, defaultValue: T): T;`,
        `/**
    * Create and save a stateful object in the \`state\` store within the global \`StateStore\`.
    * Objects created by this method are deleted when they are not used or called in a rendering iteration
    * @param {string} key unique identifier of the state within its store.
    * @param {any} value initial value
    * @param {Function} onInit a function that will execute when the state is initialized.
    * If the return value of this function is a function itself,
    * it will be executed whe the state is destroyed.
    * @param {Function} onRemoved a function that will execute when the state has been destroyed.
    * @returns {StateArray} state as an Array
    */
   export function setState<T>(
       key: string,
       value: T,
       onInit?: () => Function,
       onRemoved?: () => void
   ): StateArray<T>;`,
        `/**
   * Create and save a stateful object in the \`cache\` store within the global \`StateStore\`.
   * Objects created by this method are not deleted when they are not used,
   * unless the number of cached object exceed the maximum allocated size which is by default \`1000\`.
   * Older states will be deleted first.
   * @param {string} key unique identifier of the state within its store.
   * @param {any} value initial value
   * @param {Function} onInit a function that will execute when the state is initialized.
   * If the return value of this function is a function itself,
   * it will be executed whe the state is destroyed.
   * @param {Function} onRemoved a function that will execute when the state has been destroyed.
   * @returns {StateArray} state as an array.
   */
  export function setCache<T>(
      key: string,
      value: T,
      onInit?: () => Function | void,
      onRemoved?: () => void
  ): StateArray<T>;`,
        `/**
  * Execute an effect.
  * @param {string} key identifier.
  * @param {Function} callback callback to be executed.
  * @param {Array} dependencies effect dependencies that will decide if the effect should be called again.
  */
 export function setEffect(
     key: string,
     dependencies: Array<any>,
     callback: () => Function | void
 ): void;`,
        `/**
 * Batch update made within the callback.
 * Used generally to state update after an asynchronous call.
 * The callback function should not be an asynchronous function.
 */
export function updateOn(callback: () => void): void;`,
        `/**
    * Add a style sheet that will be evaluated every time the app rerender.
    * Can be used multiple times, at any depth within the tree of components.
    *  @param style style sheet declaration.
    */
   export function setStyle(style: FreeStyleSheet): void;`,
    ].join("\n");
}

function tsconfig() {
    return `{
        "compilerOptions": {
            "outDir": "./dist/",
            "noImplicitAny": true,
            "module": "es6",
            "target": "es5",
            "allowJs": true,
            "moduleResolution": "node"
        }
    }
    `;
}

function webpack() {
    const common = `const path = require("path");

    module.exports = {
        entry: "./src/index.js",
        output: {
            filename: "main.js",
            path: path.resolve(__dirname, "dist"),
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/,
                },
                { test: /\.html$/, use: ["html-loader"] },
                {
                    test: /\.s[ac]ss|css$/i,
                    use: ["style-loader", "css-loader", "sass-loader"],
                },
                {
                    test: /\.ttf$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                esModule: false,
                                name: "[name].[hash].[ext]",
                                outputPath: "styles",
                            },
                        },
                    ],
                    type: "javascript/auto",
                },
                {
                    test: /\.svg|png|jpg|gif$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                esModule: false,
                                name: "[name].[hash].[ext]",
                                outputPath: "imgs",
                            },
                        },
                    ],
                    type: "javascript/auto",
                },
                {
                    test: /\.pdf|md$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                esModule: false,
                                name: "[name].[hash].[ext]",
                                outputPath: "files",
                            },
                        },
                    ],
                    type: "javascript/auto",
                },
            ],
        },
    };
    `;

    const dev = `const HtmlWebpackPlugin = require("html-webpack-plugin");
    const path = require("path");
    const { merge } = require("webpack-merge");
    const common = require("./webpack.common");
    const webpack = require("webpack");
    
    const mode = "development";
    
    module.exports = merge(common, {
        mode,
        output: {
            filename: "main.js",
            path: path.resolve(__dirname, "dist"),
            publicPath: "/",
        },
        plugins: [
            new HtmlWebpackPlugin({ template: "./public/index.html" }),
            new webpack.DefinePlugin({
                "typeof window": JSON.stringify("object"),
                "process.env.NODE_ENV": JSON.stringify(mode),
            }),
        ],
        module: {
            rules: [],
        },
        devServer: {
            hot: true,
            liveReload: false,
            static: {
                directory: path.join(__dirname, "public"),
            },
            historyApiFallback: true,
        },
    });
    `;

    const prod = `const path = require("path");
    const { merge } = require("webpack-merge");
    const common = require("./webpack.common");
    const { CleanWebpackPlugin } = require("clean-webpack-plugin");
    const TerserPlugin = require("terser-webpack-plugin");
    const HTMLWebpackPlugin = require("html-webpack-plugin");
    
    module.exports = merge(common, {
        mode: "production",
        output: {
            filename: "main.[contenthash].js",
            path: path.resolve(__dirname, "docs"),
            publicPath: "/",
        },
        optimization: {
            minimizer: [
                new TerserPlugin(),
                new HTMLWebpackPlugin({
                    template: "./public/index.html",
                    filename: "index.html",
                    minify: {
                        removeAttributeQuotes: true,
                        collapseWhitespace: true,
                        removeComments: true,
                    },
                }),
                new HTMLWebpackPlugin({
                    template: "./public/index.html",
                    filename: "404.html",
                    minify: {
                        removeAttributeQuotes: true,
                        collapseWhitespace: true,
                        removeComments: true,
                    },
                }),
            ],
        },
        plugins: [new CleanWebpackPlugin()],
        module: {
            rules: [],
        },
    });
    `;

    return { common, dev, prod };
}

function packageJson(name, { ts = false, sass = false }) {
    return `{
        "name": \"${name}\",
        "version": "1.0.0",
        "description": "",
        "main": "src/index.js",
        "scripts": {
            "start": "webpack-dev-server --config webpack.dev.js --open",
            "build": "webpack --config webpack.prod.js"
        },
        "keywords": [],
        "author": "",
        "license": "MIT"
    }`;
}

function gitignore() {
    return `
/node_modules
/dist
.vscode`;
}

function html(name) {
    return `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${name}</title>
            <!-- <link rel="icon" href="logo.png" /> -->
        </head>
        <body></body>
    </html>`;
}
