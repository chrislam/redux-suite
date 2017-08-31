// @flow
import {
    createStore as createStoreDefault,
    combineReducers,
    applyMiddleware,
    compose as composeDefault
} from "redux";
import thunk from "redux-thunk";

export default function createStore(
    reducers: Object,
    options: { isDev: boolean } = { isDev: false }
): Object {
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

    return createStoreDefault(
        reducer,
        {},
        compose(applyMiddleware(...middleware))
    );
}
