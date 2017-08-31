// @flow
import createAction from "~/lib/createAction";
import { PENDING, RESOLVED, REJECTED } from "~/lib/ReduxAction";

describe('createAction()', () => {
    describe('when `payload` is not a promise', () => {
        test('it should create a proper action', () => {
            const generate = createAction("FOO"),
                action = generate('foo');

            expect(action.name).toEqual('FOO');
            expect(action.payload).toEqual('foo');
            expect(action.meta.actionStatus).toEqual(RESOLVED);
        });
    });

    describe('when `payload` is a promise', () => {
        test('it should create a proper payload when promise is resolved',
        (done) => {
            const generate = createAction("FOO"),
                promise = new Promise((resolve) => {
                    setTimeout(resolve.bind(null, 'foo'), 200);
                });

            let actions = [];
            const end = function() {
                const [ pending, resolved ] = actions;

                expect(pending.payload).toEqual(promise);
                expect(pending.meta.actionStatus).toEqual(PENDING);

                expect(resolved.payload).toEqual('foo');
                expect(resolved.meta.actionStatus).toEqual(RESOLVED);

                done();
            };


            generate(promise)((action) => {
                actions.push(action);
                if(actions.length === 2) end();
            });
        });

        test('it should create a proper payload when promise is rejected',
        (done) => {
            const generate = createAction("FOO"),
                promise = new Promise((resolve, reject) => {
                    setTimeout(reject.bind(null, 'foo'), 200);
                });

            let actions = [];
            const end = function() {
                const [ pending, resolved ] = actions;

                expect(pending.payload).toEqual(promise);
                expect(pending.meta.actionStatus).toEqual(PENDING);

                expect(resolved.payload).toEqual('foo');
                expect(resolved.meta.actionStatus).toEqual(REJECTED);

                done();
            };


            generate(promise)((action) => {
                actions.push(action);
                if(actions.length === 2) end();
            });
        });
    });
});
