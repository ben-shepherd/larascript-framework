/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { UserCreatedListener } from '@src/app/events/listeners/UserCreatedListener';
import UserCreatedSubscriber from '@src/app/events/subscribers/UserCreatedSubscriber';
import { IUserData } from '@src/app/models/auth/User';
import UserFactory from '@src/core/domains/auth/factory/userFactory';
import Kernel from '@src/core/Kernel';
import { App } from '@src/core/services/App';
import testAppConfig from '@src/tests/config/testConfig';
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

        const eventService = App.container('events');
        
        eventService.mockEvent(UserCreatedListener)
        eventService.mockEvent(UserCreatedSubscriber)

        const testUser = new UserFactory().createWithData({
            email: 'test@example.com',
            hashedPassword: 'password',
            roles: [],
            groups: [],
            firstName: 'Tony',
            lastName: 'Stark'
        })
        
        await testUser.save();
        expect(testUser.getId()).toBeTruthy();

        const expectedPayloadCallback = (payload: IUserData) => {
            return payload.email === 'test@example.com'
        }

        expect(
            eventService.assertDispatched<IUserData>(UserCreatedListener, expectedPayloadCallback)
        ).toBeTruthy()

        // expect(
        //     eventService.assertDispatched<IUserData>(UserCreatedSubscriber, expectedPayloadCallback)
        // ).toBeTruthy()
    })

}); 