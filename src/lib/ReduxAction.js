// @flow
let counter = 0;

export const PENDING = "PENDING";
export const RESOLVED = "RESOLVED";
export const REJECTED = "REJECTED";

export default class ReduxAction {
    _payload: any;
    _name: string;
    _id: number;
    _status: string;

    constructor(name: string, payload: any) {
        this._name = name;
        this._payload = payload;
        this._id = counter += 1;
        this._status = this.async ? PENDING : RESOLVED;
    }

    get meta(): Object {
        return {
            actionID: this._id,
            actionStatus: this._status
        };
    }

    get payload(): any {
        return this._payload;
    }

    get type(): string {
        return `[${this._id}] ${this.name} > ${this.status}`;
    }

    get name(): string {
        return this._name;
    }

    get status(): string {
        return this._status;
    }

    get async(): boolean {
        if (typeof this._payload === "function") return true;

        const value = this._payload.promise || this._payload;

        return value instanceof Promise;
    }

    createThunk(): Function {
        return (dispatch: Function): Promise<Object> => {
            const send = (data?: any) => {
                const action = this.export();
                if (data) action.payload = data;
                return dispatch(action);
            };

            // safe guard
            if (!this.async) return Promise.resolve(send());

            send();

            let promise =
                typeof this._payload === "function"
                    ? Promise.resolve(this._payload(send))
                    : this._payload.promise || this._payload;

            return promise.then(
                resolved => {
                    this._payload = resolved;
                    this._status = RESOLVED;
                    return send();
                },
                rejected => {
                    this._payload = rejected;
                    this._status = REJECTED;
                    return send();
                }
            );
        };
    }

    export(): Object {
        return {
            type: this.type,
            name: this.name,
            meta: this.meta,
            payload: this._payload
        };
    }
}
