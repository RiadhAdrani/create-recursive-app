import { Column, H2, H3, Input, P, Row, Spacer } from "@riadh-adrani/recursive-web/html";
import { goTo, Link, renderRoute } from "..";
import NavigationItemComponent from "../components/NavigationItem.Component";

export default () => {
    return Column({
        style: {
            scoped: true,
            normal: {
                alignItems: "center",
                textAlign: "center",
                width: "100%",
            },
        },
        children: [
            H2({ children: "Routing" }),
            P({
                children: ["Create complexe UI using nested routes."],
            }),
            P({
                children: [
                    "Click the link below or enter some data in the input box and see how the url changes.",
                ],
            }),
            Spacer({ height: "20px" }),
            Column({
                children: [
                    NavigationItemComponent("Normal nested route", "/routing/nested"),
                    Spacer({ height: "10px" }),
                    H3({ children: "OR" }),
                    Spacer({ height: "10px" }),
                    Input({
                        placeholder: "Dynamic nested route id",
                        onInput: (event) => {
                            const id = event.target.value.trim();

                            if (id != "") {
                                goTo(`/routing/dynamic=:${id};`);
                            }
                        },
                    }),
                ],
            }),
            Spacer({ height: "20px" }),
            renderRoute(),
        ],
    });
};
