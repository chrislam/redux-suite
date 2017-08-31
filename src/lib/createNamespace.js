// @flow
import Immutable from "seamless-immutable";

export default function createNamespace(
    name: string,
    constants: Array<string>
): Object {
    const output = {};

    constants.forEach((value: string) => {
        const constant = value.toUpperCase(),
            key = `${name.toUpperCase()}/${constant}`;
        output[constant] = key;
    });

    return Immutable.from(output);
}
