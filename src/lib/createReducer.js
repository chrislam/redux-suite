// @flow
export default function createReducer(cases: Object, defaultState: any): Function {
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
