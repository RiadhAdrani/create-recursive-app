import { P, Img, H1, A, Spacer, Column } from "@riadh-adrani/recursive-web/html";
import { setStyle, Render } from "@riadh-adrani/recursive-web";

import logo from "./logo.png";

const app = () => {
    setStyle({
        selectors: {
            "body,html": {
                margin: "0px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
                alignItems: "center",
                height: "100%",
                background: "#1e1e1e",
                fontFamily: "Helvetica",
                color: "white",
            },
            p: {
                margin: "0px",
            },
            h1: {
                margin: "0px",
                padding: "5px",
            },
            ".used": {
                padding: "8px",
                marginBottom: "10px",
                fontStyle: "italic",
                fontFamily: "monospace",
                fontSize: "17px",
                color: "white",
                backgroundColor: "#cf2026",
                borderRadius: "4px",
            },
        },
        animations: {
            float: {
                "0%,100%": {
                    transform: "translateX(0px)",
                },
                "50%": {
                    transform: "translateX(25px)",
                },
            },
        },
    });

    return Column({
        style: {
            className: "wrapper",
            normal: {
                border: ["2px", "solid", "#cf2026"],
                borderRadius: "5px",
                padding: ["30px", "70px"],
                alignItems: "center",
            },
            hover: {
                background: "#cf202611",
            },
        },
        children: [
            Img({
                src: logo,
                width: "250",
                style: {
                    className: "animated-logo",
                    normal: { animation: "float 1.5s ease-out infinite" },
                },
            }),
            H1({ children: "Create Recursive App" }),
            Spacer({ height: "30px" }),
            A({
                href: "https://github.com/RiadhAdrani/recursive-web",
                target: "blank",
                className: "used",
                children: "@riadh-adrani/recursive-web : ^0.1.6",
            }),
            Spacer({ height: "30px" }),
            P({ children: "Thank you for trying Recursive 😀" }),
            Spacer({ height: "10px" }),
            A({
                href: "https://github.com/RiadhAdrani/recursive",
                target: "blank",
                className: "used",
                children: "Support the project on github",
            }),
        ],
    });
};

// Render your app
Render({
    app,
    root: document.body,

    // if you have no router leave it as it is for the moment.
    router: {},
});
