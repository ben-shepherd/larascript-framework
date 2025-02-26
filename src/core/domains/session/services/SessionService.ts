import { generateUuidV4 } from '@src/core/util/uuid/generateUuidV4';
import { AsyncLocalStorage } from 'async_hooks';

import { ISessionService, TSessionData, TSessionObject } from '../interfaces/ISessionService';

/**
 * SessionService manages session state across asynchronous operations using AsyncLocalStorage.
 * It provides a way to maintain session context throughout the request lifecycle,
 * allowing access to session data from any point in the async execution chain
 * without explicitly passing the session through each function.
 */
class SessionService implements ISessionService {

    private asyncLocalStorage = new AsyncLocalStorage<TSessionObject>();

    /**
     * Creates a new session with a unique ID and empty data store.
     * The session is automatically stored in the current async context.
     * 
     * @returns {TSessionObject} The newly created session object
     */
    createSession<T extends TSessionData>(data?: T): TSessionObject<T> {
        const sessionId = generateUuidV4();
        const session: TSessionObject<T> = { id: sessionId, data: data || {} as T };
        this.asyncLocalStorage.enterWith(session);
        return session;
    }

    /**
     * Retrieves the current session from the async context.
     * 
     * @throws {Error} If no session exists in the current context
     * @returns {TSessionObject} The current session
     */
    getSession<T extends TSessionData>(): TSessionObject<T> {
        const session = this.asyncLocalStorage.getStore();
        if (!session) {
            throw new Error('No session found in current context');
        }
        return session as TSessionObject<T>;
    }

    /**
     * Gets the ID of the current session.
     * 
     * @throws {Error} If no session exists in the current context
     * @returns {string} The current session ID
     */
    getSessionId(): string {
        return this.getSession().id;
    }

    /**
     * Gets the data store of the current session.
     * 
     * @throws {Error} If no session exists in the current context
     * @returns {Record<string, unknown>} The session data store
     */
    getSessionData<T extends TSessionData>(): T {
        return this.getSession().data as T;
    }

    /**
     * Updates the data store of the current session.
     * 
     * @param {Record<string, unknown>} data - The new data to store in the session
     * @throws {Error} If no session exists in the current context
     */
    setSessionData<T extends TSessionData = TSessionData>(data: T) {
        const session = this.getSession();
        const updatedSession = { ...session, data };
        this.asyncLocalStorage.enterWith(updatedSession);
    }

    /**
     * Updates the data store of the current session with new data.
     * 
     * @param {Record<string, unknown>} data - The new data to store in the session
     * @throws {Error} If no session exists in the current context
     */
    updateSessionData<T extends TSessionData = TSessionData>(data: T) {
        const session = this.getSession();
        const updatedSession = { ...session, data: { ...session.data, ...data } };
        this.asyncLocalStorage.enterWith(updatedSession);
    }

}

export default SessionService;
