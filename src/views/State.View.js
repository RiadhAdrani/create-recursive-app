import { Column, H2, P, Row, Spacer } from "@riadh-adrani/recursive-web/html";
import { renderRoute } from "..";
import NavigationItem from "../components/NavigationItem.Component";

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
            H2({ children: "State Management" }),
            P({
                children: ["Manage app state using the simplest of methods."],
            }),
            P({
                children: ["A state is defined using a unique identifier"],
            }),
            P({
                children: ["Actually, there are multiple state types, select one to get started :"],
            }),
            Spacer({ height: "10px" }),
            Row({
                children: [
                    NavigationItem("SetState", "/state-management/set-state"),
                    NavigationItem("SetCache", "/state-management/set-cache"),
                    NavigationItem("SetRef", "/state-management/set-ref"),
                ],
            }),
            Spacer({ height: "10px" }),
            renderRoute(),
        ],
    });
};
