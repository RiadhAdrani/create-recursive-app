import { A, Button, CenteredColumn, H1, Img, P, Spacer } from "@riadh-adrani/recursive-web/html";
import { setStyle, setState } from "..";
import logo from "./assets/logo.png";

const App = () => {
    const [count, setCount] = setState("counter", 0);

    setStyle({
        selectors: {
            "body,html": { margin: 0, fontFamily: "system-ui", fontSize: "large" },
            button: { fontSize: "x-large" },
        },
    });

    return CenteredColumn({
        style: {
            inline: {
                padding: ["20px", "10px"],
                height: "100vh",
                boxSizing: "border-box",
            },
        },
        children: [
            Img({ src: logo, height: 50, width: 50 }),
            H1({ children: "Hello Recursive !" }),
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
                children: `You clicked me ${count} ${count > 1 ? "times" : "time"}`,
                onClick: () => setCount(count + 1),
            }),
        ],
    });
};

export default App;
