import { getParams } from ".";
import HomeView from "./views/Home.View";
import RoutingView from "./views/Routing.View";
import StateSetCache from "./views/State.SetCache.View";
import StateSetState from "./views/State.SetState.View";
import StateSetRef from "./views/State.SetRef.View";
import StateView from "./views/State.View";

export default {
    path: "/",
    component: HomeView,
    routes: [
        {
            path: "routing",
            component: RoutingView,
            routes: [
                { path: "nested", component: () => "This is a nested Route !" },
                { path: "dynamic=:id;", component: () => "Suggested Id = " + getParams().id },
            ],
        },
        {
            path: "state-management",
            component: StateView,
            routes: [
                { path: "set-cache", component: StateSetCache },
                { path: "set-ref", component: StateSetRef },
                { path: "set-state", component: StateSetState },
            ],
        },
    ],
};
