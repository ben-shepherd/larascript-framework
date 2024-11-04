/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import QueueableDriver, { TQueueDriverOptions } from '@src/core/domains/events/drivers/QueableDriver';
import EventService from '@src/core/domains/events/services/EventService';
import { IModel } from '@src/core/interfaces/IModel';
import Kernel from '@src/core/Kernel';
import { App } from '@src/core/services/App';
import testAppConfig from '@src/tests/config/testConfig';
import TestEventQueueAddAlwaysFailsEventToQueue from '@src/tests/events/events/TestEventQueueAddAlwaysFailsEventToQueue';
import TestEventQueueAlwaysFailsEvent from '@src/tests/events/events/TestEventQueueAlwaysFailsEvent';
import createWorkerTables, { dropWorkerTables } from '@src/tests/events/helpers/createWorketTables';
import TestFailedWorkerModel from '@src/tests/models/models/TestFailedWorkerModel';
import TestWorkerModel from '@src/tests/models/models/TestWorkerModel';
import TestConsoleProvider from '@src/tests/providers/TestConsoleProvider';
import TestDatabaseProvider from '@src/tests/providers/TestDatabaseProvider';
import TestEventProvider from '@src/tests/providers/TestEventProvider';


describe('mock queable event failed', () => {

    /**
   * Register the test event provider
   */
    beforeAll(async () => {
        await Kernel.boot({
            ...testAppConfig,
            providers: [
                ...testAppConfig.providers,
                new TestConsoleProvider(),
                new TestDatabaseProvider(),
                new TestEventProvider()
            ]
        }, {})
    })

    afterAll(async () => {
        // await dropWorkerTables();
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

            // todo: missing await within this logic I think
            await App.container('console').reader(['worker', '--queue=testQueue']).handle();

            expect(App.container('events').assertDispatched(TestEventQueueAlwaysFailsEvent)).toBeTruthy()
        }

        const results = await App.container('db').documentManager().table(new TestWorkerModel().table).findMany<IModel[]>({})
        expect(results.length).toBe(0)

        const failedResults = await App.container('db').documentManager().table(new TestFailedWorkerModel().table).findMany<IModel[]>({})
        expect(failedResults.length).toBe(1)
    })
}); 