/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import QueueableDriver, { TQueueDriverOptions } from '@src/core/domains/events/drivers/QueableDriver';
import EventService from '@src/core/domains/events/services/EventService';
import { IModel } from '@src/core/interfaces/IModel';
import { App } from '@src/core/services/App';
import TestEventQueueAddAlwaysFailsEventToQueue from '@src/tests/events/events/TestEventQueueAddAlwaysFailsEventToQueue';
import TestEventQueueAlwaysFailsEvent from '@src/tests/events/events/TestEventQueueAlwaysFailsEvent';
import createWorkerTables, { dropWorkerTables } from '@src/tests/events/helpers/createWorketTables';
import TestFailedWorkerModel from '@src/tests/models/models/TestFailedWorkerModel';
import TestWorkerModel from '@src/tests/models/models/TestWorkerModel';

import testHelper from '../testHelper';


describe('mock queable event failed', () => {

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
    test('test dispatch event queable ', async () => {

        await dropWorkerTables();
        await createWorkerTables();

        const eventService = App.container('events');
        const driverOptions = eventService.getDriverOptionsByName(EventService.getDriverName(QueueableDriver))?.['options'] as TQueueDriverOptions;
        const attempts = driverOptions?.retries ?? 3
            
        eventService.mockEvent(TestEventQueueAddAlwaysFailsEventToQueue)

        await eventService.dispatch(new TestEventQueueAddAlwaysFailsEventToQueue());

        expect(eventService.assertDispatched(TestEventQueueAddAlwaysFailsEventToQueue)).toBeTruthy()
    
        for(let i = 0; i < attempts; i++) {
            App.container('events').mockEvent(TestEventQueueAlwaysFailsEvent);

            await App.container('console').reader(['worker', '--queue=testQueue']).handle();

            expect(App.container('events').assertDispatched(TestEventQueueAlwaysFailsEvent)).toBeTruthy()
        }

        const results = await App.container('db').documentManager().table(new TestWorkerModel().table).findMany<IModel[]>({})
        expect(results.length).toBe(0)

        const failedResults = await App.container('db').documentManager().table(new TestFailedWorkerModel().table).findMany<IModel[]>({})
        expect(failedResults.length).toBe(1)
    })
}); 