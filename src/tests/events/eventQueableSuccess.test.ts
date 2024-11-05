/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { IModel } from '@src/core/interfaces/IModel';
import Kernel from '@src/core/Kernel';
import { App } from '@src/core/services/App';
import testAppConfig from '@src/tests/config/testConfig';
import TestEventQueueCalledFromWorkerEvent from '@src/tests/events/events/TestEventQueueCalledFromWorkerEvent';
import TestEventQueueEvent from '@src/tests/events/events/TestEventQueueEvent';
import createWorkerTables, { dropWorkerTables } from '@src/tests/events/helpers/createWorketTables';
import TestWorkerModel from '@src/tests/models/models/TestWorkerModel';
import TestConsoleProvider from '@src/tests/providers/TestConsoleProvider';
import TestDatabaseProvider from '@src/tests/providers/TestDatabaseProvider';
import TestEventProvider from '@src/tests/providers/TestEventProvider';


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
    test('test queued worker ', async () => {

        await dropWorkerTables();
        await createWorkerTables();

        const eventService = App.container('events');
        
        eventService.mockEvent(TestEventQueueEvent)
        eventService.mockEvent(TestEventQueueCalledFromWorkerEvent);

        await eventService.dispatch(new TestEventQueueEvent({ hello: 'world', createdAt: new Date() }));
        
        expect(
            eventService.assertDispatched<{ hello: string }>(TestEventQueueEvent, (payload) => {
                return payload.hello === 'world'
            })
        ).toBeTruthy()

        // run the worker
        await App.container('console').reader(['worker', '--queue=testQueue']).handle();

        expect(
            eventService.assertDispatched<{ hello: string, createdAt: Date }>(TestEventQueueCalledFromWorkerEvent, (payload) => {
                return payload.hello === 'world' && payload.createdAt instanceof Date
            })
        ).toBeTruthy()


        const results = await App.container('db').documentManager().table(new TestWorkerModel().table).findMany<IModel[]>({})
        expect(results.length).toBe(0)
    })

}); 