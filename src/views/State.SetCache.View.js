import { Column, H3, Input, P, Spacer } from "@riadh-adrani/recursive-web/html";
import { setCache } from "..";

export default () => {
    const [text, setText] = setCache("setCacheText", "Something we will need later... Maybe ?");

    return Column({
        children: [
            H3({ children: "setCache" }),
            Spacer({ height: "10px" }),
            P({
                children: `The cached value is : "${text}"`,
            }),
            Spacer({ height: "5px" }),
            Input({
                id: "color-input",
                value: text,
                onInput: (e) => {
                    setText(e.target.value);
                },
            }),
            Spacer({ height: "10px" }),
            P({
                children: '"setCache()" create a stateful object with the given id.',
            }),
            Spacer({ height: "5px" }),
            P({
                children:
                    "Returns an array including the current value and a function that the developer may use to change the value of the state and update the UI",
            }),
            Spacer({ height: "5px" }),
            P({
                children: "This state object is not removed when not needed.",
            }),
            Spacer({ height: "5px" }),
            P({
                children:
                    "Try writing something in the input box, navigate to another route, comeback and you will find the exact same value that you left it on.",
            }),
        ],
    });
};
