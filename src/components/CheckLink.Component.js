import { A } from "@riadh-adrani/recursive-web/html";

export default (text, link) => {
    return A({
        children: text,
        href: link,
        target: "_blank",
        style: {
            inline: { color: "black", margin: "5px" },
        },
    });
};
