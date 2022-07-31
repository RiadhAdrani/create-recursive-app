import { Column, H3, Input, P, Spacer } from "@riadh-adrani/recursive-web/html";
import { setState } from "..";

export default () => {
    const [text, setText] = setState("setStateText", "setState");

    return Column({
        children: [
            H3({ children: "setState" }),
            Spacer({ height: "10px" }),
            P({
                children: `The value of the state is : ${text}`,
            }),
            Spacer({ height: "5px" }),
            Input({
                value: text,
                type: "text",
                onInput: (e) => {
                    setText(e.target.value);
                },
            }),
            Spacer({ height: "10px" }),
            P({
                children: '"setState()" create a stateful object with the given id.',
            }),
            Spacer({ height: "5px" }),
            P({
                children:
                    "Returns an array including the current value and a function that the developer may use to change the value of the state and update the UI",
            }),
            Spacer({ height: "5px" }),
            P({
                children: "The state object is removed automatically when its no longer needed.",
            }),
            Spacer({ height: "5px" }),
            P({
                children:
                    "Try writing something in the input box, navigate to another route, comeback and you will find the initial value.",
            }),
        ],
    });
};
