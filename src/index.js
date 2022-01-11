import { Recursive, Components, Style } from "@riadh-adrani/recursive";

import logo from "./logo.png";

const { P, Column, Img, H1, A, Span } = Components;

// Enable disable dev logs
Recursive.DevMode(true);

// Create a style Sheet
Style.SetStyle({
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

// Render your app
Recursive.Render(() =>
     Column({
          styleSheet: {
               className: "wrapper",
               normal: {
                    border: "2px solid #cf202655",
                    borderRadius: "5px",
                    padding: "30px 70px",
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
                    style: { animation: "float 1.5s ease-out infinite" },
               }),
               H1({ text: "Hello Recrusive" }),
               P({
                    text: "Thank you for trying Recursive 😀",
                    styleSheet: {
                         className: "hello-recursive",
                         normal: {
                              padding: "5px",
                              margin: "0px",
                         },
                    },
               }),
               A({
                    href: "https://github.com/RiadhAdrani/recursive",
                    target: "blank",
                    style: {
                         background: "#cf202655",
                         marginTop: "15px",
                         padding: "5px 10px",
                         color: "white",
                    },
                    children: ["Support the project on github"],
               }),
          ],
     })
);
