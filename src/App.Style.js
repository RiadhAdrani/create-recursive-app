import { setStyle } from ".";

export default () => {
    setStyle({
        var: {
            darker: "#8d181b",
            dark: "#ae1f23",
            main: "#cf2026",
        },
        selectors: {
            "*": {
                fontFamily: "arial",
                lineHeight: "1.35em",
            },
            body: {
                margin: "0px",
                height: "100vh",
                display: "flex",
            },
            "h1,h2,h3,h4,h5,h6": {
                fontFamily: "system-ui",
                margin: "0px",
                padding: ["5px", "0px"],
            },
            h3: {
                fontWeight: 600,
            },
            p: {
                margin: "0px",
            },
        },
    });
};
