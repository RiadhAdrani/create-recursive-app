import { Link } from "@riadh-adrani/recursive-web/html";
import { getVar } from "@riadh-adrani/recursive-web/style/methods";
import { getRoute } from "..";

export default (text, to) => {
    const selected = to == getRoute();

    return Link({
        children: text,
        href: to,
        style: {
            scoped: true,
            normal: {
                padding: ["5px", "10px"],
                margin: "5px",
                borderBottom: ["3px", "solid", selected ? getVar("main") : "transparent"],
                color: "black",
                textDecoration: "none",
                borderRadius: "2.5px",
            },
            hover: {
                background: "#00000011",
            },
            active: {
                background: "#00000022",
            },
        },
    });
};
