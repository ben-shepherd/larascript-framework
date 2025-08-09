/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { queryBuilder } from '@src/core/domains/eloquent/services/EloquentQueryBuilderService';
import { events } from '@src/core/domains/events/services/EventService';
import { app } from '@src/core/services/App';
import TestEventQueueCalledFromWorkerEvent from '@src/tests/larascript/events/events/TestEventQueueCalledFromWorkerEvent';
import TestEventQueueEvent from '@src/tests/larascript/events/events/TestEventQueueEvent';
import resetWorkerTables from '@src/tests/larascript/events/helpers/createWorketTables';
import TestWorkerModel from '@src/tests/larascript/models/models/TestWorkerModel';
import testHelper from '@src/tests/testHelper';
import { z } from 'zod';


describe('mock queable event', () => {

    /**
   * Register the test event provider
   */
    beforeAll(async () => {
        await testHelper.testBootApp()
    })


    /**
     * - Dispatch TestEventQueueEvent, this will add a queued item to the database
     * - Run the worker, which will dispatch TestEventQueueCalledFromWorkerEvent
     * - Check the events have been dispatched
     * - Check the worker empty has been cleared
     */
    test('test queued worker ', async () => {

        await resetWorkerTables()

        events().mockEvent(TestEventQueueEvent)
        events().mockEvent(TestEventQueueCalledFromWorkerEvent);

        await events().dispatch(new TestEventQueueEvent({ hello: 'world', createdAt: new Date() }));

        type TPayload = {
            hello: string,
            createdAt: Date
        }
        const validatePayload = (payload: TPayload) => {
            const schema = z.object({
                hello: z.string(),
                createdAt: z.date()
            })
            schema.parse(payload)

            return payload.hello === 'world' && payload.createdAt instanceof Date
        }

        expect(events().assertDispatched<TPayload>(TestEventQueueEvent, validatePayload)).toBeTruthy()

        await app('console').readerService(['worker', '--queue=testQueue']).handle();

        expect(events().assertDispatched<TPayload>(TestEventQueueCalledFromWorkerEvent, validatePayload)).toBeTruthy()

        const results = await queryBuilder(TestWorkerModel).get()
        expect(results.count()).toBe(0)
    })

}); 