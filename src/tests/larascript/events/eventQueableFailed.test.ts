/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { console } from '@src/core/domains/console/service/ConsoleService';
import { queryBuilder } from '@src/core/domains/eloquent/services/EloquentQueryBuilderService';
import QueueableDriver, { TQueueDriverOptions } from '@src/core/domains/events/drivers/QueableDriver';
import EventService, { events } from '@src/core/domains/events/services/EventService';
import TestEventQueueAddAlwaysFailsEventToQueue from '@src/tests/larascript/events/events/TestEventQueueAddAlwaysFailsEventToQueue';
import TestEventQueueAlwaysFailsEvent from '@src/tests/larascript/events/events/TestEventQueueAlwaysFailsEvent';
import resetWorkerTables from '@src/tests/larascript/events/helpers/createWorketTables';
import TestFailedWorkerModel from '@src/tests/larascript/models/models/TestFailedWorkerModel';
import TestWorkerModel from '@src/tests/larascript/models/models/TestWorkerModel';
import testHelper from '@src/tests/testHelper';


describe('mock queable event failed', () => {

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
    test('test dispatch event queable ', async () => {

        await resetWorkerTables()

        const driverOptions = events().getDriverOptionsByName(EventService.getDriverName(QueueableDriver))?.['options'] as TQueueDriverOptions;
        const attempts = driverOptions?.retries ?? 3
            
        events().mockEvent(TestEventQueueAddAlwaysFailsEventToQueue)

        await events().dispatch(new TestEventQueueAddAlwaysFailsEventToQueue());

        expect(events().assertDispatched(TestEventQueueAddAlwaysFailsEventToQueue)).toBeTruthy()
    
        for(let i = 0; i < attempts; i++) {
            events().mockEvent(TestEventQueueAlwaysFailsEvent);

            await console().readerService(['worker', '--queue=testQueue']).handle();

            expect(events().assertDispatched(TestEventQueueAlwaysFailsEvent)).toBeTruthy()
        }

        const results = await queryBuilder(TestWorkerModel).get();
        expect(results.count()).toBe(0)

        const failedResults = await queryBuilder(TestFailedWorkerModel).get();
        expect(failedResults.count()).toBe(1)
    })
}); 