import {
    A,
    Column,
    Footer,
    H1,
    H3,
    Hr,
    Img,
    Nav,
    Spacer,
    Sub,
} from "@riadh-adrani/recursive-web/html";
import { renderRoute } from ".";
import { getVar } from "@riadh-adrani/recursive-web/style/methods";
import AppStyle from "./App.Style";
import logo from "./assets/logo.png";
import NavigationItemComponent from "./components/NavigationItem.Component";

export default () => {
    AppStyle();

    return Column({
        style: {
            className: "app",
            normal: { alignItems: "center", padding: ["20px", "80px"], flex: 1 },
        },
        children: [
            Img({ src: logo, height: 100, width: 100 }),
            H1({
                children: "Recursive",
                style: { scoped: true, normal: { color: getVar("main") } },
            }),
            H3({ children: "Project generated using 'create-recursive-app'" }),
            Spacer({ height: "10px" }),
            Hr({ width: "200px", size: "1px", color: "#aaaaaa" }),
            Spacer({ height: "10px" }),
            Nav({
                style: { scoped: true, normal: { padding: ["5px", "0px"] } },
                children: [
                    NavigationItemComponent("Home", "/"),
                    NavigationItemComponent("Routing", "/routing"),
                    NavigationItemComponent("State Management", "/state-management"),
                ],
            }),
            Column({
                style: {
                    inline: {
                        flex: 1,
                        padding: "30px",
                        margin: "20px",
                        backgroundColor: "#0000000a",
                        borderRadius: "5px",
                        alignSelf: "stretch",
                    },
                },
                children: renderRoute(),
            }),
            Footer({
                children: [
                    Sub({
                        children: [
                            "Developed and tested by the one man army ",
                            A({
                                children: "Adrani Riadh",
                                href: "https://github.com/RiadhAdrani",
                                target: "_blank",
                                style: {
                                    inline: {
                                        color: getVar("main"),
                                        textDecoration: "none",
                                        fontWeight: "bold",
                                    },
                                },
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });
};
