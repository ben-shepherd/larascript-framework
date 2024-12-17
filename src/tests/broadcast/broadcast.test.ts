import { describe, expect, test } from '@jest/globals';
import Broadcaster from '@src/core/domains/broadcast/abstract/Broadcaster';
import BroadcastListener from '@src/core/domains/broadcast/abstract/BroadcastEvent';

type TestListenerPayload = {
    number: number
}

/**
 * Test Broadcast Listener
 */
class TestListener extends BroadcastListener<TestListenerPayload> {

    getListenerName(): string {
        return 'test';
    }

}

/**
 * Test Class that will be used to handle the broadcasting, simulating communication between concerns
 */
class TestClass extends Broadcaster {}

describe('broadcast', () => {
    test('dispatch, subscribe once', async () => {

        const submitPayload = { number: 1 };
        const expectedPayload = { number: 1 };
        let receivedPayload: TestListenerPayload | null = null;

        // Subscribe to the event
        const testClass = new TestClass();
        testClass.broadcastSubscribeOnce<TestListener>({
            listener: TestListener,
            callback: async (payload) => {
                receivedPayload = payload
            }
        })

        // Dispatch the event
        await testClass.broadcastDispatch(new TestListener(submitPayload));

        // Check the event was removed from the listeners array
        const listeners = testClass.getListeners();
        const expectedListener = listeners.find(listener => listener.name === 'test');

        // Check the payload was received
        expect(receivedPayload).toEqual(expectedPayload);
        expect(expectedListener).toBeUndefined();
    });

    test('dispatch, multiple subscribe', async () => {

        const submitPayload = { number: 1 };
        const expectedPayload = { number: 3 };
        let receivedPayload: TestListenerPayload = { ...submitPayload} as TestListenerPayload;

        // Subscribe to the event
        const testClass = new TestClass();

        testClass.broadcastSubscribe<TestListener>({
            listener: TestListener,
            callback: async (payload) => {
                receivedPayload = { ...receivedPayload, number: receivedPayload.number + payload.number }
            }
        })

        // Dispatch the event 2 times
        for(let i = 0; i < 2; i++) {
            await testClass.broadcastDispatch(new TestListener(submitPayload));
        }

        // Check the payload was received
        expect(receivedPayload).toEqual(expectedPayload);

        // Check the event was removed from the listeners array
        const listenersShouldExist = testClass.getListeners();
        const expectedListenerShouldExist = listenersShouldExist.find(listener => listener.name === 'test');
        expect(expectedListenerShouldExist).toBeTruthy();

        // Manually unsubscribe
        testClass.broadcastUnsubscribe({ listener: TestListener });

        // Check the event was removed from the listeners array
        const listenersNotExist = testClass.getListeners();
        const expectedListenerNotExist = listenersNotExist.find(listener => listener.name === 'test');
        expect(expectedListenerNotExist).toBeUndefined();

    });
});