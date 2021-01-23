"use strict";
exports.__esModule = true;
exports.subscribe = exports.routerAtom = exports.plugin = exports.clearErrorsAction = exports.canActivateAction = exports.canDeactivateAction = exports.cancelTransitionAction = exports.navigateToAction = exports.transitionSuccessAction = exports.transitionErrorAction = exports.transitionCancelAction = exports.transitionStartAction = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@reatom/core");
var moduleName = 'router';
var getName = function (name) {
    if (!name) {
        return moduleName;
    }
    return moduleName + "/" + name;
};
var startAction = core_1.declareAction(getName('start'));
var stopAction = core_1.declareAction(getName('stop'));
exports.transitionStartAction = core_1.declareAction(getName('transitionStart'));
exports.transitionCancelAction = core_1.declareAction(getName('transitionCancel'));
exports.transitionErrorAction = core_1.declareAction(getName('transitionError'));
exports.transitionSuccessAction = core_1.declareAction(getName('transitionSuccess'));
exports.navigateToAction = core_1.declareAction(getName('navigateTo'));
exports.cancelTransitionAction = core_1.declareAction(getName('cancelTransition'));
exports.canDeactivateAction = core_1.declareAction(getName('canDeactivate'));
exports.canActivateAction = core_1.declareAction(getName('canActivate'));
exports.clearErrorsAction = core_1.declareAction(getName('clearErrors'));
var initialState = {
    route: null,
    previousRoute: undefined,
    transitionRoute: undefined,
    transitionError: undefined
};
exports.plugin = function (dispatch) {
    return function () { return ({
        onStart: function () {
            dispatch(startAction());
        },
        onStop: function () {
            dispatch(stopAction());
        },
        onTransitionStart: function (toState, fromState) {
            dispatch(exports.transitionStartAction({ toState: toState, fromState: fromState }));
        },
        onTransitionCancel: function (toState, fromState) {
            dispatch(exports.transitionCancelAction({ toState: toState, fromState: fromState }));
        },
        onTransitionSuccess: function (toState, fromState) {
            dispatch(exports.transitionSuccessAction({ toState: toState, fromState: fromState }));
        },
        onTransitionError: function (toState, fromState, err) {
            dispatch(exports.transitionErrorAction({ toState: toState, fromState: fromState, err: err }));
        }
    }); };
};
exports.routerAtom = core_1.declareAtom(getName(), initialState, function (on) { return [
    on(exports.transitionStartAction, function (state, _a) {
        var toState = _a.toState;
        return (tslib_1.__assign(tslib_1.__assign({}, state), { transitionRoute: toState, transitionError: undefined }));
    }),
    on(exports.transitionSuccessAction, function (state, _a) {
        var toState = _a.toState, fromState = _a.fromState;
        return (tslib_1.__assign(tslib_1.__assign({}, state), { route: toState, transitionRoute: undefined, transitionError: undefined, previousRoute: fromState }));
    }),
    on(exports.transitionErrorAction, function (state, _a) {
        var toState = _a.toState, err = _a.err;
        return (tslib_1.__assign(tslib_1.__assign({}, state), { transitionRoute: toState, transitionError: err }));
    }),
    on(exports.clearErrorsAction, function (state) { return (tslib_1.__assign(tslib_1.__assign({}, state), { transitionRoute: undefined, transitionError: undefined })); }),
]; });
function subscribe(store, router) {
    router.usePlugin(exports.plugin(store.dispatch));
    router.setDependency('store', store);
    store.subscribe(function (action) {
        var navigateToType = exports.navigateToAction.getType();
        var cancelTransitionType = exports.cancelTransitionAction.getType();
        var canDeactivateType = exports.canDeactivateAction.getType();
        var canActivateType = exports.canActivateAction.getType();
        switch (action.type) {
            case navigateToType:
                var actionNavigateTo = action;
                router.navigate(actionNavigateTo.payload.name, actionNavigateTo.payload.params || {}, actionNavigateTo.payload.opts || {});
                break;
            case cancelTransitionType:
                router.cancel();
                break;
            case canDeactivateType:
                var actionСanDeactivate = action;
                router.canDeactivate(actionСanDeactivate.payload.name, actionСanDeactivate.payload.canDeactivate);
                break;
            case canActivateType:
                var actionCanActivate = action;
                router.canActivate(actionCanActivate.payload.name, actionCanActivate.payload.canActivate);
                break;
            default:
                break;
        }
    });
}
exports.subscribe = subscribe;
