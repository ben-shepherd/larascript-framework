/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { app } from '@src/core/services/App';
import TestEventSyncBadPayloadEvent from '@src/tests/larascript/events/events/TestEventSyncBadPayloadEvent';
import TestEventSyncEvent from '@src/tests/larascript/events/events/TestEventSyncEvent';
import testHelper from '@src/tests/testHelper';

describe('mock event service', () => {

    /**
   * Register the test event provider
   */
    beforeAll(async () => {
        await testHelper.testBootApp()
    })

    /**
   * Dispatch a synchronus event
   */
    test('test dispatch event sync with valid payload', async () => {

        const eventService = app('events');

        eventService.mockEvent(TestEventSyncEvent)

        await eventService.dispatch(new TestEventSyncEvent({ hello: 'world' }));

        expect(
            eventService.assertDispatched<{ hello: string }>(TestEventSyncEvent, (payload) => {
                return payload.hello === 'world'
            })
        ).toBeTruthy()
    })

    /**
   * Dispatch a synchronus event
   */
    test('test dispatch event sync with invalid payload', async () => {

        const eventService = app('events');

        eventService.mockEvent(TestEventSyncBadPayloadEvent)

        await eventService.dispatch(new TestEventSyncBadPayloadEvent({ unexpectedProperty: 123 }));

        expect(eventService.assertDispatched(TestEventSyncBadPayloadEvent)).toBeTruthy()

        expect(
            eventService.assertDispatched<{ hello: string }>(TestEventSyncBadPayloadEvent, (payload) => {
                return payload.hello === 'world'
            })
        ).toBeFalsy()
    })
}); 