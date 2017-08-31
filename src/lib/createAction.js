// @flow
import ReduxAction from "./ReduxAction";

export default function createAction(name: string): Function {
    return function(payload: any): Function | Object {
        const action = new ReduxAction(name, payload);
        if (!action.async) return action.export();

        return action.createThunk();
    };
}
