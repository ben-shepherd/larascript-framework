/* eslint-disable no-unused-vars */
export type TSessionData = Record<string, unknown>;
export type TSessionObject<T extends TSessionData = TSessionData> = { id: string, data: T };

export interface ISessionService {
    createSession<T extends TSessionData>(data?: T): TSessionObject<T>;
    getSession<T extends TSessionData>(): TSessionObject<T>;
    getSessionId(): string;
    getSessionData<T extends TSessionData>(): T;
    setSessionData<T extends TSessionData>(data: T): void;
    updateSessionData<T extends TSessionData>(data: T): void;
}