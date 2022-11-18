import { action, atom, Ctx } from '@reatom/core';
import {
  Plugin,
  State as StateRouter5,
  PluginFactory,
  NavigationOptions,
} from 'router5';

export type State = {
  route?: StateRouter5;
  previousRoute?: StateRouter5;
  transitionRoute?: StateRouter5;
  transitionError?: string;
};

export type NavigationToProps = {
  name: string;
  params?: Record<string, any>;
  opts?: NavigationOptions;
};

type RouterActionProp = {
  toState?: StateRouter5;
  fromState?: StateRouter5;
  err?: string;
};

const initialState: State = {
  route: undefined,
  previousRoute: undefined,
  transitionRoute: undefined,
  transitionError: undefined,
};

const moduleName = 'router';

export const routerAtom = atom<State>(initialState, moduleName);

export const atomNaming = (name: string) => {
  return `${moduleName}.${name}`;
};

const transitionStartAction = action((ctx, payload: RouterActionProp) => {
  routerAtom(ctx, {
    ...ctx.get(routerAtom),
    transitionRoute: payload.toState,
    transitionError: undefined,
  });
}, atomNaming('transitionStart'));

const transitionSuccessAction = action((ctx, payload: RouterActionProp) => {
  routerAtom(ctx, {
    ...ctx.get(routerAtom),
    route: payload.toState,
    transitionRoute: undefined,
    transitionError: undefined,
    previousRoute: payload.fromState,
  });
}, atomNaming('transitionSuccess'));

const transitionErrorAction = action((ctx, payload) => {
  routerAtom(ctx, {
    ...ctx.get(routerAtom),
    transitionRoute: payload.toState,
    transitionError: payload.err,
  });
}, atomNaming('transitionError'));

export const navigateToAction = action<NavigationToProps>(
  atomNaming('navigateTo'),
);

export const plugin =
  (ctx: Ctx): PluginFactory =>
  (router): Plugin => {
    ctx.subscribe(navigateToAction, (action) => {
      const payload = action[0]?.payload;
      if (payload && router) {
        router.navigate(payload.name, payload.params || {}, payload.opts || {});
      }
    });

    return {
      onTransitionStart(toState, fromState) {
        transitionStartAction(ctx, { toState, fromState });
      },
      onTransitionSuccess(toState, fromState) {
        transitionSuccessAction(ctx, { toState, fromState });
      },
      onTransitionError(toState, fromState, err) {
        transitionErrorAction(ctx, { toState, fromState, err });
      },
    };
  };
