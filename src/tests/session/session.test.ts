/* eslint-disable no-undef */
import { describe, expect, test } from '@jest/globals';
import SessionService from '@src/core/domains/session/services/SessionService';

describe('SessionService', () => {
    let sessionService: SessionService;

    beforeEach(() => {
        sessionService = new SessionService();
    });

    test('should create a new session with unique ID', () => {
        const session = sessionService.createSession();
        
        expect(session).toBeDefined();
        expect(session.id).toBeDefined();
        expect(typeof session.id).toBe('string');
        expect(session.data).toEqual({});
    });

    test('should throw error when getting session without creating one', () => {
        expect(() => {
            sessionService.getSession();
        }).toThrow('No session found in current context');
    });

    test('should get session after creating one', () => {
        const createdSession = sessionService.createSession();
        const retrievedSession = sessionService.getSession();

        expect(retrievedSession).toBeDefined();
        expect(retrievedSession?.id).toBe(createdSession.id);
        expect(retrievedSession?.data).toEqual({});
    });

    test('should get session ID', () => {
        const session = sessionService.createSession();
        const sessionId = sessionService.getSessionId();

        expect(sessionId).toBe(session.id);
    });

    test('should get and set session data', () => {
        sessionService.createSession();
        
        const testData = { user: 'test', role: 'admin' };
        sessionService.setSessionData(testData);
        
        const sessionData = sessionService.getSessionData();
        expect(sessionData).toEqual(testData);
    });

    test('should update session data while preserving existing values', () => {
        sessionService.createSession();
        
        // Set initial data
        const initialData = { user: 'test', role: 'admin' };
        sessionService.setSessionData(initialData);
        
        // Update with new data
        const updateData = { role: 'user', email: 'test@example.com' };
        sessionService.updateSessionData(updateData);
        
        // Check that new data is merged with existing data
        const sessionData = sessionService.getSessionData();
        expect(sessionData).toEqual({
            user: 'test',
            role: 'user',
            email: 'test@example.com'
        });
    });

    test('should throw error when setting data without active session', () => {
        const testData = { user: 'test' };
        
        expect(() => {
            sessionService.setSessionData(testData);
        }).toThrow('No session found in current context');
    });
});