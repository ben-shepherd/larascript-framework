import { beforeAll, describe, test } from '@jest/globals';
import Repository from '@src/core/base/Repository';
import Kernel from '@src/core/Kernel';
import { App } from '@src/core/services/App';
import testAppConfig from '@src/tests/config/testConfig';
import TestQueueSubscriber from '@src/tests/events/subscribers/TestQueueSubscriber';
import { TestMovieModel } from '@src/tests/models/models/TestMovie';
import TestConsoleProvider from '@src/tests/providers/TestConsoleProvider';
import TestDatabaseProvider from '@src/tests/providers/TestDatabaseProvider';
import TestEventProvider from '@src/tests/providers/TestEventProvider';
import 'dotenv/config';
import { DataTypes } from 'sequelize';

const createTable = async () => {
    await App.container('db').schema().createTable('testsWorker', {
        queueName: DataTypes.STRING,
        eventName: DataTypes.STRING,
        payload: DataTypes.JSON,
        attempt: DataTypes.INTEGER,
        retries: DataTypes.INTEGER,
        createdAt: DataTypes.DATE
    });

    await App.container('db').schema().createTable('tests', {
        name: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    });
}

const dropTable = async () => {
    await App.container('db').schema().dropTable('tests')
    await App.container('db').schema().dropTable('testsWorker')
}

const movieName = 'testMovie';

describe('mock event service', () => {

    /**
   * Setup MongoDB
   * Setup Kernel with test Console and Event provider
   */
    beforeAll(async () => {
        await Kernel.boot({
            ...testAppConfig,
            providers: [
                new TestDatabaseProvider(),
                new TestConsoleProvider(),
                new TestEventProvider()
            ]
        }, {});
    });


    /**
   * Dispatches the TestQueueSubscriber event to the worker
   */
    test('dispatch a test event', async () => {
        await dropTable()
        await createTable()

        // Dispatch an event
        const events = App.container('events');
        await events.dispatch(new TestQueueSubscriber({ name: movieName }));

        // Wait for the event to be processed
        await App.container('console').reader(['worker']).handle();

        // Check if the movie was created
        const repository = new Repository<TestMovieModel>(TestMovieModel);
        const movie = await repository.findOne({ name: movieName });
        expect(typeof movie?.getId() === 'string').toBe(true)
        expect(movie?.getAttribute('name')).toBe(movieName);

        await movie?.delete();
        expect(movie?.data).toBeNull();
    });


});