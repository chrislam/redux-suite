// @flow
import {
    createStore as createStoreDefault,
    combineReducers,
    applyMiddleware,
    compose as composeDefault
} from "redux";
import thunk from "redux-thunk";
import ReduxAction from "./lib/ReduxAction";

let store;

export function createNamespace(
    name: string,
    constants: Array<string>
): Object {
    const output = {};

    constants.forEach((value: string) => {
        const constant = value.toUpperCase(),
            key = `${name.toUpperCase()}/${constant}`;
        output[constant] = key;
    });

    return output;
}

export function createAction(name: string): Function {
    return function(payload: any): Function | Object {
        const action = new ReduxAction(name, payload);
        if (!action.async) return action.export();

        return action.createThunk();
    };
}

export function createReducer(cases: Object, defaultState: any): Function {
    return function(state: any = defaultState, action: Object): any {
        const { meta, name } = action;
        let handler = cases[name];

        if (!handler || !meta) return state;

        const status = meta.actionStatus.toLowerCase();
        if (typeof handler === "function") handler = { resolved: handler };

        if (!handler[status]) return state;

        return handler[status](state, action);
    };
}

export function createStore(
    reducers: Object,
    options: { isDev: boolean } = { isDev: false }
): void {
    const reducer = combineReducers(reducers);
    let middleware = [thunk];
    let compose = composeDefault;

    if (options.isDev) {
        let logger = require("redux-logger").createLogger({
            collapsed: true,
            stateTransformer(state) {
                let newState = {};
                for (var i of Object.keys(state)) {
                    newState[i] = state[i].asMutable();
                }

                return newState;
            }
        });

        middleware.push(logger);

        const { composeWithDevTools } = require("remote-redux-devtools");
        compose = composeWithDevTools;
    }

    store = createStoreDefault(
        reducer,
        {},
        compose(applyMiddleware(...middleware))
    );
}
