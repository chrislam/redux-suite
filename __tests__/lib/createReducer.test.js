// @flow
import createReducer from "~/lib/createReducer";
import createAction from "~/lib/createAction";
import { PENDING, RESOLVED, REJECTED } from "~/lib/ReduxAction";

describe('createReducer()', () => {
    describe('when `payload` is not a promise', () => {
        test('it creates a proper reducer', () => {
            const reducer = createReducer({
                FOO(state: any, action: Object) {
                    expect(action.payload).toEqual('foo');
                    expect(action.meta.actionStatus).toEqual(RESOLVED);
                }
            }, {});

            const dispatch = function(action) {
                reducer({}, action);
            };

            const generate = createAction("FOO"),
                action = generate('foo');

            dispatch(action);
        });
    });

    describe('when `payload` is a promise', () => {
        test('it creates a proper reducer that handle `RESOLVED` status only',
        (done) => {
            const reducer = createReducer({
                FOO(state: any, action: Object) {
                    expect(action.payload).toEqual('foo');
                    expect(action.meta.actionStatus).toEqual(RESOLVED);
                    done();
                }
            }, {});

            const dispatch = function(action) {
                reducer({}, action);
            };

            const generate = createAction("FOO"),
                promise = new Promise((resolve) => {
                    setTimeout(resolve.bind(null, 'foo'), 200);
                });

            generate(promise)(dispatch);
        });

        test('it creates a proper reducer than handle multiple status',
        (done) => {
            const reducer = createReducer({
                FOO: {
                    pending(state: any, action: Object) {
                        expect(action.payload).toBeInstanceOf(Promise);
                        expect(action.meta.actionStatus).toEqual(PENDING);
                    },

                    resolved(state: any, action: Object) {
                        expect(action.payload).toEqual('foo');
                        expect(action.meta.actionStatus).toEqual(RESOLVED);

                        generate(promiseB)(dispatch);
                    },

                    rejected(state: any, action: Object) {
                        expect(action.payload).toEqual('foo');
                        expect(action.meta.actionStatus).toEqual(REJECTED);
                        done();
                    },
                }
            });

            const dispatch = function(action) {
                reducer({}, action);
            };

            const generate = createAction("FOO"),
                promiseA = new Promise((resolve) => {
                    setTimeout(resolve.bind(null, 'foo'), 200);
                }),
                promiseB = new Promise((resolve, reject) => {
                    setTimeout(reject.bind(null, 'foo'), 200);
                });

            generate(promiseA)(dispatch);
        });
    });
});
