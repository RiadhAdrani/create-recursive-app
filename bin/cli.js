#!/usr/bin/env node
import inquirer from "inquirer";
import fs from "fs";
import { execSync } from "child_process";
import cypher from "@riadh-adrani/cypher-writer";
import prettier from "prettier";
const { mprt, xprt, cnst, fn, stmt, key, docs } = cypher;

function writeIntoFile(text, filepath) {
    try {
        fs.writeFileSync(filepath, prettier.format(text, { filepath }));
    } catch (e) {
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
        {
            type: "list",
            name: "css",
            message: "Choose your preprocessor",
            choices: [
                { name: "Css", value: "css", checked: true },
                { name: "Sass", value: "sass" },
            ],
        },
    ])
    .then((answers) => {
        const options = {
            ts: answers.lang === "ts",
            sass: (answers.css = "sass"),
        };

        const repo = "test";

        const dir = (path) => `${repo}/${path}`;

        runCommand(`mkdir ${repo}`);
        runCommand(`mkdir ${repo}/public`);
        runCommand(`mkdir ${repo}/src`);
        runCommand(`mkdir ${repo}/src/app`);

        const { common, dev, prod } = webpack(options);

        writeIntoFile(gitignore(), dir(".gitignore"));
        writeIntoFile(packageJson(repo, options), dir("package.json"));
        writeIntoFile(common, dir("webpack.common.js"));
        writeIntoFile(dev, dir("webpack.dev.js"));
        writeIntoFile(prod, dir("webpack.prod.js"));
        writeIntoFile(html(repo), dir("/public/index.html"));
        writeIntoFile(index("js", options), dir("/src/index.js"));
        writeIntoFile(index("dts", options), dir("/src/index.d.ts"));
        writeIntoFile(template(repo), dir("src/app/app.js"));

        runCommand(`cd ${repo} && npm install`);
        runCommand(`cd ${repo} && git init`);

        console.log("Almost there !");
        console.log("install dependencies and start development server : ");

        console.log("\x1b[32m", `cd ${repo} && npm i`);
        console.log("\x1b[32m", `npm start`);

        console.log("\x1b[0m", "Happy coding !");
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
                cnst("[count,setCount]", 'setState("counter", 0)'),
                `setStyle({
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
                        H1({ children: "Hello ${repo} !" }),
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

function index(type) {
    const webApp = "webApp";

    const isTS = type === "ts" || type === "dts";
    const isDTS = type === "dts";

    const exportFn = ({
        name,
        params = [],
        body = "",
        returnType = "void",
        isDTS = false,
        isTS = false,
        typeParameters,
        jsDocs,
    }) => {
        const parameters = params.map((p) => (isDTS || isTS ? key(p[0], p[1]) : p[0]));

        return (
            docs(jsDocs) +
            "\n" +
            "export " +
            fn({
                name,
                parameters,
                body,
                isDeclaration: isDTS,
                isTypescript: isTS,
                returnType,
                typeParameters,
                isArrowFunction: false,
            })
        );
    };

    const exportedFunctions = [
        {
            name: "getParams",
            parameters: [],
            body: ["return webApp.getParams()"],
            returnType: "ObjectOf<string>",
            docs: [
                "Calculate the parameters of the current path and returns them as a key-value object.",
                " @throws an error when the router is not initialized.",
            ],
        },
        {
            name: "goTo",
            parameters: [["path", "string"]],
            body: ["return webApp.goTo(path)"],
            docs: [
                "Change the current route and trigger an update if needed.",
                "@throws an error when the router is not initialized.",
                "@param {string} path Destination path.",
            ],
        },
        {
            name: "renderRoute",
            parameters: [],
            body: ["return webApp.renderRoute()"],
            returnType: "BaseElement",
            docs: [
                "Used to inject a route component into the elements tree.",
                "Could be used recursively within nested routes to render the appropriate components",
                " @throws an error when the router is not initialized.",
                "* @returns The current route fragment element.",
            ],
        },
        {
            name: "getRoute",
            parameters: [],
            body: ["return webApp.getRoute()"],
            returnType: "string",
            docs: [
                " Retrieve the current route as string.",
                "@throws an error when the router is not initialized.",
            ],
        },
        {
            name: "getAnchor",
            parameters: [],
            body: ["return webApp.getAnchor()"],
            returnType: "string",
            docs: [
                "return the currently targeted anchor",
                " @throws an error when the router is not initialized.",
            ],
        },
        {
            name: "getBase",
            parameters: [],
            body: ["return webApp.getBase()"],
            returnType: "string",
            docs: [
                "Return the base of the application.",
                "@throws an error when the router is not initialized.",
                "@returns {string} Base as string.",
            ],
        },
        {
            name: "getState",
            parameters: [["key", "string"]],
            body: ["return webApp.getState(key)"],
            typeParameters: ["T = any"],
            returnType: "StateArray<T>",
            docs: [
                "Retrieve an existing stateful object from the `state` store if it exists.",
                "@param {string} key identifier",
                "@throw an error if the state does not exist.",
                "@returns {StateArray} state as an array.",
            ],
        },
        {
            name: "getCache",
            parameters: [["key", "string"]],
            body: ["return webApp.getCache(key)"],
            typeParameters: ["T = any"],
            returnType: "StateArray<T>",
            docs: [
                "Retrieve an existing stateful object from the `cache` store if it exists.",
                "@param {string} key identifier",
                "@throw an error if the state does not exist.",
                "@returns {StateArray} state as an array.",
            ],
        },
        {
            name: "getRef",
            parameters: [
                ["key", "string"],
                ["defaultValue", "T"],
            ],
            typeParameters: ["T = HTMLElement"],
            body: ["return webApp.getRef(key, defaultValue)"],
            returnType: "T",
            docs: [
                "Retrieve an existing element from the `reference` store, or the default value.",
                "Use the `hooks.onRef` hook and return a string from the function to initialize a new reference.",
            ],
        },
        {
            name: "setState",
            parameters: [
                ["key", "string"],
                ["value", "T"],
                ["onInit", "() => Function"],
                ["onRemoved", "() => void"],
            ],
            body: ["return webApp.setState(key, value, onInit, onRemoved)"],
            typeParameters: ["T"],
            returnType: "StateArray<T>",
            docs: [
                "Create and save a stateful object in the `state` store within the global `StateStore`.",
                ,
                "Objects created by this method are deleted when they are not used or called in a rendering iteration",
                "@param {string} key unique identifier of the state within its store.",
                "@param {any} value initial value",
                "@param {Function} onInit a function that will execute when the state is initialized.",
                "If the return value of this function is a function itself,",
                "it will be executed whe the state is destroyed.",
                "@param {Function} onRemoved a function that will execute when the state has been destroyed.",
                "@returns {StateArray} state as an Array",
            ],
        },
        {
            name: "setCache",
            parameters: [
                ["key", "string"],
                ["value", "T"],
                ["onInit", "() => (Function | void)"],
                ["onRemoved", "() => void"],
            ],
            body: ["return webApp.setCache(key, value, onInit, onRemoved)"],
            typeParameters: ["T"],
            returnType: "StateArray<T>",
            docs: [
                "Create and save a stateful object in the `cache` store within the global `StateStore`.",
                "Objects created by this method are not deleted when they are not used,",
                "unless the number of cached object exceed the maximum allocated size which is by default `1000`.",
                "Older states will be deleted first.",
                "@param {string} key unique identifier of the state within its store.",
                "@param {any} value initial value",
                "@param {Function} onInit a function that will execute when the state is initialized.",
                "If the return value of this function is a function itself,",
                "it will be executed whe the state is destroyed.",
                "@param {Function} onRemoved a function that will execute when the state has been destroyed.",
                "@returns {StateArray} state as an array.",
            ],
        },
        {
            name: "setEffect",
            parameters: [
                ["key", "string"],
                ["dependencies", "Array<any>"],
                ["callback", "() => (Function | void)"],
            ],
            body: ["return webApp.setEffect(key, dependencies, callback)"],
            docs: [
                "Execute an effect.",
                "@param {string} key identifier.",
                "@param {Function} callback callback to be executed.",
                "@param {Array} dependencies effect dependencies that will decide if the effect should be called again.",
            ],
        },
        {
            name: "updateOn",
            parameters: [["callback", "() => void"]],
            body: ["webApp.updateOn(callback)"],
            docs: [
                "Batch update made within the callback.",
                "Used generally to state update after an asynchronous call.",
                "`The callback function should not be an asynchronous function.`",
            ],
        },
        {
            name: "setStyle",
            parameters: [["style", "FreeStyleSheet"]],
            body: ["webApp.setStyle(style)"],
            docs: [
                "Add a style sheet that will be evaluated every time the app rerender.",
                "Can be used multiple times, at any depth within the tree of components.",
                " @param style style sheet declaration.",
            ],
        },
    ];

    return [
        mprt(
            ["RecursiveWebApp", "createComponentStyle", "importFile", "mergeComponentStyles"],
            "@riadh-adrani/recursive-web"
        ),
        mprt(["FreeStyleSheet"], "@riadh-adrani/recursive-web/lib"),
        mprt(["createElement", "createRoute"], "@riadh-adrani/recursive-web/use"),
        "",
        isDTS || isTS ? mprt(["ObjectOf"], "@riadh-adrani/recursive-web/types/util") : "",
        isDTS || isTS ? mprt(["StateArray", "BaseElement"], "@riadh-adrani/recursive/lib") : "",
        "",
        isDTS ? "" : mprt("app", "./app/App"),
        "",
        isDTS
            ? ""
            : cnst(
                  webApp,
                  "new RecursiveWebApp({ root: document.body, app, base: '', scopedStyle: false,scrollCorrection: false, })"
              ),
        "",
        xprt(["importFile", "mergeComponentStyles"]),
        xprt(["createComponentStyle", "createElement", "createRoute"]),
        "",
        ...exportedFunctions.map((fn) =>
            exportFn({
                name: fn.name,
                typeParameters: fn.typeParameters,
                body: fn.body,
                params: fn.parameters,
                returnType: fn.returnType,
                isDTS,
                isTS,
                jsDocs: fn.docs,
            })
        ),
        "",
        isDTS ? "" : stmt("webApp.render()"),
    ].join("\n");
}

function webpack({ ts = false, sass = false }) {
    const common = [
        mprt("path", "path", true),
        xprt(
            [
                `entry: "./src/index.js"`,
                `output: { filename: "main.js", path: path.resolve(__dirname, "dist"),}`,
                `modules: { 
                rules: [
                    { test: /\\.html$/, use: ["html-loader"] },
                    {
                        test: /\\.ttf$/,
                        use: [
                            {
                                loader: "file-loader",
                                options: {
                                    esModule: false,
                                    name: "[name].[hash].[ext]",
                                    outputPath: "fonts",
                                },
                            },
                        ],
                        type: "javascript/auto",
                    },
                    {
                        test: /\\.css|scss|less$/,
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
                        test: /\\.svg|png|jpg|gif$/,
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
                        test: /\\.pdf|md$/,
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
                ] 
            }`,
            ],
            false,
            true
        ),
    ].join("\n");

    const dev = [
        mprt("HtmlWebpackPlugin", "html-webpack-plugin", true),
        mprt("path", "path", true),
        mprt(["merge"], "webpack-merge", true),
        mprt("common", "./webpack.common"),
        mprt("webpack", "webpack"),
        cnst("mode", "development"),
        xprt(
            [
                "mode",
                `output: {
                        filename: "main.js",
                        path: path.resolve(__dirname, "dist"),
                        publicPath: "/",
                }`,
                `plugins: [
                        new HtmlWebpackPlugin({ template: "./public/index.html" }),
                        new webpack.DefinePlugin({
                            "typeof window": JSON.stringify("object"),
                            "process.env.NODE_ENV": JSON.stringify(mode),
                        }),
                    ]`,
                `module: {
                        rules: [],
                }`,
                `devServer: {
                        hot: true,
                        liveReload: false,
                        static: {
                            directory: path.join(__dirname, "public"),
                        },
                        historyApiFallback: true,
                }`,
            ],
            false,
            true
        ),
    ].join("\n");

    const prod = [
        mprt("HtmlWebpackPlugin", "html-webpack-plugin", true),
        mprt("path", "path", true),
        mprt(["merge"], "webpack-merge", true),
        mprt("common", "./webpack.common", true),
        mprt(["CleanWebpackPlugin"], "clean-webpack-plugin", true),
        mprt("TerserPlugin", "terser-webpack-plugin", true),
        cnst("mode", "production"),
        xprt(
            [
                "mode",
                `output: {
                    filename: "main.[contenthash].js",
                    path: path.resolve(__dirname, "docs"),
                    publicPath: "/",
                }`,
                `optimization: {
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
                                collapseWhitespace: true,                                    removeComments: true,
                            },
                        }),
                    ],
                }`,
                `plugins: [new CleanWebpackPlugin()]`,
                `module: {
                    rules: [],
                }`,
            ],
            false,
            true
        ),
    ].join("\n");

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
        "license": "MIT",
        "dependencies": {
            "@riadh-adrani/recursive-web": "^0.7.55"
        },
        "devDependencies": {
            "clean-webpack-plugin": "^4.0.0",
            "file-loader": "^6.2.0",
            "html-loader": "^3.1.0",
            "html-webpack-plugin": "^5.5.0",
            "terser-webpack-plugin": "^5.3.0",
            "webpack-cli": "^4.9.1",
            "webpack-dev-server": "^4.7.2",
            "webpack-merge": "^5.8.0"
        }
    }`;
}

function gitignore() {
    return `# dependencies
            /node_modules

            # production
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
