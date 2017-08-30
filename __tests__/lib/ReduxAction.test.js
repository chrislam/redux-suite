// @flow
import ReduxAction, { PENDING, RESOLVED, REJECTED } from "~/lib/ReduxAction";

describe("ReduxAction", () => {
    describe("when `payload` is not a promise", () => {
        test("it should create a non-async action", () => {
            const action = new ReduxAction("FOO", "baz");
            expect(action.type).toEqual("[1] FOO > RESOLVED");
            expect(action.name).toEqual("FOO");
            expect(action.payload).toEqual("baz");
            expect(action.meta).toEqual({
                actionID: 1,
                actionStatus: RESOLVED
            });
        });
    });

    describe("when `payload` is a promise", () => {
        test("it should create an async action when promise is resolved", () => {
            const promise = Promise.resolve("foo");
            const action = new ReduxAction("FOO", promise);
            expect(action.meta).toEqual({
                actionID: 2,
                actionStatus: PENDING
            });

            const thunk = action.createThunk();
            let actions = [];

            thunk((action: Object) => {
                actions.push(action);

                if (actions.length === 2) {
                    expect(action.type).toEqual("[2] FOO > RESOLVED");
                    expect(action.name).toEqual("FOO");
                    expect(action.payload).toEqual("foo");
                    expect(action.meta).toEqual({
                        actionID: 2,
                        actionStatus: RESOLVED
                    });
                }
            });
        });

        test("it should create an async action when promise is rejected", () => {
            const promise = Promise.reject("foo");
            const action = new ReduxAction("FOO", promise);
            expect(action.meta).toEqual({
                actionID: 3,
                actionStatus: PENDING
            });

            const thunk = action.createThunk();
            let actions = [];

            thunk(action => {
                actions.push(action);

                if (actions.length === 2) {
                    expect(action.type).toEqual("[3] FOO > REJECTED");
                    expect(action.name).toEqual("FOO");
                    expect(action.payload).toEqual("foo");
                    expect(action.meta).toEqual({
                        actionID: 3,
                        actionStatus: REJECTED
                    });
                }
            });
        });
    });

    describe("when `payload` is an object contains promise", () => {
        test("it should still create an async action", () => {
            const payload = {
                promise: Promise.resolve("foo"),
                foo: "baz",
                data: "foo"
            };

            const action = new ReduxAction("FOO", payload);
            expect(action.payload).toEqual(payload);
            expect(action.meta).toEqual({
                actionID: 4,
                actionStatus: PENDING
            });

            const thunk = action.createThunk();
            let actions = [];

            thunk(action => {
                actions.push(action);

                if (actions.length === 2) {
                    expect(action.type).toEqual("[4] FOO > RESOLVED");
                    expect(action.payload).toEqual("foo");
                    expect(action.meta).toEqual({
                        actionID: 4,
                        actionStatus: RESOLVED
                    });
                }
            });
        });
    });

    describe("when `payload` is a function", () => {
        test("it should create an async action", done => {
            const action = new ReduxAction("FOO", send => {
                send("foo");

                return new Promise((resolve, reject) => {
                    setTimeout(resolve, 200);
                });
            });

            const thunk = action.createThunk();
            let actions = [];

            thunk(action => {
                actions.push(action);
            }).then(() => {
                done();
            });
        });
    });
});
