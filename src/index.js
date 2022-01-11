import { Recursive, Components } from "@riadh-adrani/recursive";

const { P } = Components;

Recursive.DevMode(true);

Recursive.Render(() =>
     P({
          text: "Hello Recursive !",
          styleSheet: {
               className: "cringesse",
               normal: {
                    background: "#1e1e1e",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    margin: "0px",
               },
          },
     })
);
