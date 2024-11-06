/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { IUserData } from '@src/app/models/auth/User';
import UserFactory from '@src/core/domains/auth/factory/userFactory';
import Kernel from '@src/core/Kernel';
import { App } from '@src/core/services/App';
import testAppConfig from '@src/tests/config/testConfig';
import { TestUserCreatedListener } from '@src/tests/events/events/auth/TestUserCreatedListener';
import TestUserCreatedSubscriber from '@src/tests/events/events/auth/TestUserCreatedSubscriber';
import TestConsoleProvider from '@src/tests/providers/TestConsoleProvider';
import TestDatabaseProvider from '@src/tests/providers/TestDatabaseProvider';
import TestEventProvider from '@src/tests/providers/TestEventProvider';

import { dropWorkerTables } from './helpers/createWorketTables';


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
        await dropWorkerTables();
    })


    /**
     * - Dispatch TestEventQueueEvent, this will add a queued item to the database
     * - Run the worker, which will dispatch TestEventQueueCalledFromWorkerEvent
     * - Check the events have been dispatched
     * - Check the worker empty has been cleared
     */
    test('test queued worker ', async () => {

        const eventService = App.container('events');
        
        eventService.mockEvent(TestUserCreatedListener)
        eventService.mockEvent(TestUserCreatedSubscriber)

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
            return payload.id === testUser.getId() && payload.email === 'test@example.com'
        }

        expect(
            eventService.assertDispatched<IUserData>(TestUserCreatedListener, expectedPayloadCallback)
        ).toBeTruthy()

        expect(
            eventService.assertDispatched<IUserData>(TestUserCreatedSubscriber, expectedPayloadCallback)
        ).toBeTruthy()
    })


}); 