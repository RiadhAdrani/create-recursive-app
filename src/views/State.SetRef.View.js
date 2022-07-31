import { Column, H3, Input, P, Spacer } from "@riadh-adrani/recursive-web/html";
import { getVar } from "@riadh-adrani/recursive-web/style/methods";
import { getRef } from "..";

export default () => {
    return Column({
        children: [
            H3({ children: "setRef" }),
            Spacer({ height: "10px" }),
            P({
                hooks: { onRef: () => "colorful-text" },
                style: {
                    inline: { padding: "10px", backgroundColor: getVar("darker"), color: "white" },
                },
                children: "Pick a color to change my color !",
            }),
            Spacer({ height: "5px" }),
            Input({
                id: "color-input",
                style: { inline: { alignSelf: "center" } },
                type: "color",
                onInput: (e) => {
                    getRef("colorful-text").style.backgroundColor = e.target.value;
                },
            }),
            Spacer({ height: "10px" }),
            P({
                children:
                    '"setRef" is a hook used within a component to create a reference of a DOM element.',
            }),
            Spacer({ height: "5px" }),
            P({
                children: `We can later retrieve the element using "getRef" to manipulate the element directly like the good old days.`,
            }),
        ],
    });
};
