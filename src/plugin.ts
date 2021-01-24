import { declareAction, declareAtom, Store, Action } from "@reatom/core";

import {
  State as StateRouter5,
  Plugin,
  Router,
  NavigationOptions,
} from "router5";

export type StateRoute = (StateRouter5 & Record<string, any>) | null;

export type State = {
  route?: StateRoute;
  previousRoute?: StateRouter5;
  transitionRoute?: StateRouter5;
  transitionError?: string;
};

type RouterActionProp = {
  toState?: StateRouter5;
  fromState?: StateRouter5;
  err?: string;
};

type NavigationToProps = {
  name: string;
  params?: any;
  opts?: NavigationOptions;
};

type CanDeactivateProps = {
  name: string;
  canDeactivate: boolean;
};

type CanActivateProps = {
  name: string;
  canActivate: boolean;
};

const moduleName = 'router';

const getName = (name?: string) => {
  if(!name){
    return moduleName;
  }
  return `${moduleName}/${name}`
}

const startAction = declareAction(getName('start'));
const stopAction = declareAction(getName('stop'));
export const transitionStartAction = declareAction<RouterActionProp>(getName('transitionStart'));
export const transitionCancelAction = declareAction<RouterActionProp>(getName('transitionCancel'));
export const transitionErrorAction = declareAction<RouterActionProp>(getName('transitionError'));
export const transitionSuccessAction = declareAction<RouterActionProp>(getName('transitionSuccess'));
export const navigateToAction = declareAction<NavigationToProps>(getName('navigateTo'));
export const cancelTransitionAction = declareAction(getName('cancelTransition'));
export const canDeactivateAction = declareAction(getName('canDeactivate'));
export const canActivateAction = declareAction(getName('canActivate'));
export const clearErrorsAction = declareAction(getName('clearErrors'));

const initialState: State = {
  route: null,
  previousRoute: undefined,
  transitionRoute: undefined,
  transitionError: undefined,
};

export const plugin = (dispatch: Store["dispatch"]) => {
  return (): Plugin => ({
    onStart() {
      dispatch(startAction());
    },
    onStop() {
      dispatch(stopAction());
    },
    onTransitionStart(toState, fromState) {
      dispatch(transitionStartAction({ toState, fromState }));
    },
    onTransitionCancel(toState, fromState) {
      dispatch(transitionCancelAction({ toState, fromState }));
    },
    onTransitionSuccess(toState, fromState) {
      dispatch(transitionSuccessAction({ toState, fromState }));
    },
    onTransitionError(toState, fromState, err) {
      dispatch(transitionErrorAction({ toState, fromState, err }));
    },
  });
};

export const routerAtom = declareAtom(getName(),initialState, (on) => [
  on(transitionStartAction, (state, { toState }) => ({
    ...state,
    transitionRoute: toState,
    transitionError: undefined,
  })),
  on(transitionSuccessAction, (state, { toState, fromState }) => ({
    ...state,
    route: toState,
    transitionRoute: undefined,
    transitionError: undefined,
    previousRoute: fromState,
  })),
  on(transitionErrorAction, (state, { toState, err }) => ({
    ...state,
    transitionRoute: toState,
    transitionError: err,
  })),
  on(clearErrorsAction, (state) => ({
    ...state,
    transitionRoute: undefined,
    transitionError: undefined,
  })),
]);

export function subscribe(store: Store, router: Router) {
  router.usePlugin(plugin(store.dispatch));
  router.setDependency('store',store);
  store.subscribe((action) => {
    const navigateToType = navigateToAction.getType();
    const cancelTransitionType = cancelTransitionAction.getType();
    const canDeactivateType = canDeactivateAction.getType();
    const canActivateType = canActivateAction.getType();

    switch (action.type) {
      case navigateToType:
        const actionNavigateTo = action as Action<NavigationToProps>;
        router.navigate(
          actionNavigateTo.payload.name,
          actionNavigateTo.payload.params || {},
          actionNavigateTo.payload.opts || {}
        );
        break;
      case cancelTransitionType:
        router.cancel();
        break;
      case canDeactivateType:
        const actionСanDeactivate = action as Action<CanDeactivateProps>;
        router.canDeactivate(
          actionСanDeactivate.payload.name,
          actionСanDeactivate.payload.canDeactivate
        );
        break;
      case canActivateType:
        const actionCanActivate = action as Action<CanActivateProps>;
        router.canActivate(
          actionCanActivate.payload.name,
          actionCanActivate.payload.canActivate
        );
        break;
      default:
        break;
    }
  });
}
