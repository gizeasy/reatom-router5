import { Store } from "@reatom/core";
import { State as StateRouter5, Plugin, Router, NavigationOptions } from "router5";
export declare type StateRoute = (StateRouter5 & Record<string, any>) | null;
export declare type State = {
    route?: StateRoute;
    previousRoute?: StateRouter5;
    transitionRoute?: StateRouter5;
    transitionError?: string;
};
declare type RouterActionProp = {
    toState?: StateRouter5;
    fromState?: StateRouter5;
    err?: string;
};
declare type NavigationToProps = {
    name: string;
    params?: any;
    opts?: NavigationOptions;
};
export declare const transitionStartAction: import("@reatom/core").PayloadActionCreator<RouterActionProp, string>;
export declare const transitionCancelAction: import("@reatom/core").PayloadActionCreator<RouterActionProp, string>;
export declare const transitionErrorAction: import("@reatom/core").PayloadActionCreator<RouterActionProp, string>;
export declare const transitionSuccessAction: import("@reatom/core").PayloadActionCreator<RouterActionProp, string>;
export declare const navigateToAction: import("@reatom/core").PayloadActionCreator<NavigationToProps, string>;
export declare const cancelTransitionAction: import("@reatom/core").ActionCreator<string>;
export declare const canDeactivateAction: import("@reatom/core").ActionCreator<string>;
export declare const canActivateAction: import("@reatom/core").ActionCreator<string>;
export declare const clearErrorsAction: import("@reatom/core").ActionCreator<string>;
export declare const plugin: (dispatch: Store["dispatch"]) => () => Plugin;
export declare const routerAtom: import("@reatom/core").Atom<State>;
export declare function subscribe(store: Store, router: Router): void;
export {};
