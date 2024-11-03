/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import QueueableDriver, { TQueueDriverOptions } from '@src/core/domains/events/drivers/QueableDriver';
import EventService from '@src/core/domains/events/services/EventService';
import { IModel } from '@src/core/interfaces/IModel';
import Kernel from '@src/core/Kernel';
import { App } from '@src/core/services/App';
import testAppConfig from '@src/tests/config/testConfig';
import TestConsoleProvider from '@src/tests/providers/TestConsoleProvider';
import TestEventProvider from '@src/tests/providers/TestEventProvider';

import TestFailedWorkerModel from '../models/models/TestFailedWorkerModel';
import TestWorkerModel from '../models/models/TestWorkerModel';
import TestDatabaseProvider from '../providers/TestDatabaseProvider';
import TestEventQueueAddAlwaysFailsEventToQueue from './events/TestEventQueueAddAlwaysFailsEventToQueue';
import TestEventQueueAlwaysFailsEvent from './events/TestEventQueueAlwaysFailsEvent';
import TestEventQueueEvent from './events/TestEventQueueEvent';
import createWorkerTables, { dropWorkerTables } from './helpers/createWorketTables';


describe('mock queable event', () => {

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
    // test('test queued worker ', async () => {

    //     await dropWorkerTables();
    //     await createWorkerTables();

    //     const eventService = App.container('events');
        
    //     eventService.mockEvent(TestEventQueueEvent)
    //     eventService.mockEvent(TestEventQueueCalledFromWorkerEvent);

    //     await eventService.dispatch(new TestEventQueueEvent({ hello: 'world' }));
        
    //     expect(
    //         eventService.assertDispatched<{ hello: string }>(TestEventQueueEvent, (payload) => {
    //             return payload.hello === 'world'
    //         })
    //     ).toBeTruthy()

    //     // run the worker
    //     await App.container('console').reader(['worker', '--queue-name=testQueue']).handle();

    //     expect(
    //         eventService.assertDispatched<{ hello: string }>(TestEventQueueCalledFromWorkerEvent, (payload) => {
    //             return payload.hello === 'world'
    //         })
    //     ).toBeTruthy()


    //     const results = await App.container('db').documentManager().table(new TestWorkerModel().table).findMany<IModel[]>({})
    //     expect(results.length).toBe(0)
    // })

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

        expect(eventService.assertDispatched(TestEventQueueEvent)).toBeTruthy()
    
        for(let i = 0; i < attempts; i++) {
            eventService.mockEvent(TestEventQueueAlwaysFailsEvent);

            await App.container('console').reader(['worker', '--queue-name=testQueue']).handle();

            expect(eventService.assertDispatched(TestEventQueueAlwaysFailsEvent)).toBeTruthy()
        }

        const results = await App.container('db').documentManager().table(new TestWorkerModel().table).findMany<IModel[]>({})
        expect(results.length).toBe(0)

        const failedResults = await App.container('db').documentManager().table(new TestFailedWorkerModel().table).findMany<IModel[]>({})
        expect(failedResults.length).toBe(1)
    })
}); 