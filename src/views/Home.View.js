import { A, Column, H1, H2, P, Spacer } from "@riadh-adrani/recursive-web/html";
import CheckLinkComponent from "../components/CheckLink.Component";
import InfoIconComponent from "../components/InfoIcon.Component";

export default () => {
    return Column({
        style: {
            scoped: true,
            normal: {
                alignItems: "center",
                textAlign: "center",
            },
        },
        children: [
            H2({ children: "What is it ?" }),
            P({
                children: [
                    "Recursive is a framework that allows developers to create beautiful component-based applications using only Javascript",
                ],
            }),
            Spacer({ height: "20px" }),
            InfoIconComponent(),
            Spacer({ height: "5px" }),
            P({ children: ["Check the following links"] }),
            Column({
                children: [
                    CheckLinkComponent("Recursive", "https://github.com/RiadhAdrani/recursive"),
                    CheckLinkComponent(
                        "Recursive Web",
                        "https://github.com/RiadhAdrani/recursive-web"
                    ),
                    CheckLinkComponent(
                        "Create Recursive App",
                        "https://github.com/RiadhAdrani/create-recursive-app"
                    ),
                ],
            }),
            Spacer({ height: "20px" }),
            InfoIconComponent(),
            Spacer({ height: "5px" }),
            P({ children: ["A problem with Recursive ? Start an issue !"] }),
            CheckLinkComponent("Post an issue", "https://github.com/RiadhAdrani/recursive/issues"),
        ],
    });
};
