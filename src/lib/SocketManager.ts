export type EventCb = (arg: any) => void | Promise<void>;

export interface ISocket {
    id: string;
    on(ev: string, listener: (reason: string) => void): this;
    emit(ev: string, ...args: any[]): boolean | this;
    disconnect(close?: boolean): this;
}

export class SocketManager<S extends ISocket> {
    protected sock: S;
    public flag: number = 0;
    private _callbacks: { [ev: string]: EventCb } = {};

    constructor(sock: S) {
        this.sock = sock;
        this.sock.on("disconnect", this.disconnect.bind(this));
        SocketManager.all.set(this.sock.id, this);
    }

    /** Get socket ID */
    public get id() { return this.sock.id; }

    public disconnect() {
        SocketManager.all.delete(this.sock.id);
        this.sock.disconnect(true);
    }

    /** Emit event to server */
    public emit(event: string, ...args: any[]) {
        // if (!(event in this._callbacks)) console.warn(`<SocketManager>: emitted event '%s' does not have a registered callback`, event);
        this.sock.emit(event, ...args);
    }

    /** Set a callback for an event. Only one callback per event. */
    public onEvent(name: string, cb: EventCb, requiredFlag?: number) {
        this._callbacks[name] = cb;
        this.sock.on(name, (arg) => {
            if (this._callbacks[name]) {
                if (requiredFlag === undefined || (this.flag & requiredFlag) === requiredFlag)
                    this._callbacks[name](arg);
            }
        });
    }

    /** Invoke event unto oneself (NB only awaits if this._callbacks[name] returns Promise. */
    public async invokeEvent(name: string, arg?: any) {
        if (this._callbacks[name]) await this._callbacks[name](arg);
    }

    /** Is an event registered in this name? */
    public hasEvent(ev: string) {
        return ev in this._callbacks;
    }

    /** Log message to console */
    public log(...args: any[]) {
        console.log(`<${this.sock.id}>`, ...args);
    }

    /** Map sock IDs to their class */
    public static all = new Map<string, SocketManager<ISocket>>();
}