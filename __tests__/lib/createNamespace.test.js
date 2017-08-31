// @flow
import createNamespace from "~/lib/createNamespace";

describe('createNamespace()', () => {
    describe('when in __DEV__ mode', () => {
        test('it should produce an immutable object', () => {
            const output = createNamespace('foo', ['baz']);

            function assign() {
                output.BAZ = "FOO";
            }

            expect(assign).toThrowError();
        });
    });
});
