/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { IModel } from '@src/core/interfaces/IModel';
import { App } from '@src/core/services/App';
import TestEventQueueCalledFromWorkerEvent from '@src/tests/events/events/TestEventQueueCalledFromWorkerEvent';
import TestEventQueueEvent from '@src/tests/events/events/TestEventQueueEvent';
import createWorkerTables, { dropWorkerTables } from '@src/tests/events/helpers/createWorketTables';
import TestWorkerModel from '@src/tests/models/models/TestWorkerModel';

import testHelper from '../testHelper';


describe('mock queable event', () => {

    /**
   * Register the test event provider
   */
    beforeAll(async () => {
        await testHelper.testBootApp()
    })

    afterAll(async () => {
        await dropWorkerTables();
    })


    /**
     * - Dispatch TestEventQueueEvent, this will add a queued item to the database
     * - Run the worker, which will dispatch TestEventQueueCalledFromWorkerEvent
     * - Check the events have been dispatched
     * - Check the worker empty has been cleared
     */
    test('test queued worker ', async () => {

        await dropWorkerTables();
        await createWorkerTables();

        const eventService = App.container('events');
        
        eventService.mockEvent(TestEventQueueEvent)
        eventService.mockEvent(TestEventQueueCalledFromWorkerEvent);

        await eventService.dispatch(new TestEventQueueEvent({ hello: 'world', createdAt: new Date() }));

        type TPayload = {
            hello: string,
            createdAt: Date
        }
        const validatePayload = (payload: TPayload) => {
            return payload.hello === 'world' && payload.createdAt instanceof Date
        }
        
        expect(eventService.assertDispatched<TPayload>(TestEventQueueEvent, validatePayload)).toBeTruthy()

        await App.container('console').reader(['worker', '--queue=testQueue']).handle();

        expect(eventService.assertDispatched<TPayload>(TestEventQueueCalledFromWorkerEvent, validatePayload)).toBeTruthy()

        const results = await App.container('db').documentManager().table(new TestWorkerModel().table).findMany<IModel[]>({})
        expect(results.length).toBe(0)
    })

}); 