import { afterAll, beforeAll, describe, test } from '@jest/globals';
import Repository from '@src/core/base/Repository';
import DatabaseProvider from '@src/core/domains/database/providers/DatabaseProvider';
import Kernel from '@src/core/Kernel';
import { App } from '@src/core/services/App';
import testAppConfig from '@src/tests/config/testConfig';
import TestQueueSubscriber from '@src/tests/events/subscribers/TestQueueSubscriber';
import { TestMovieModel } from '@src/tests/models/models/TestMovie';
import testModelsHelper from '@src/tests/models/testModelsHelper';
import TestConsoleProvider from '@src/tests/providers/TestConsoleProvider';
import TestEventProvider from '@src/tests/providers/TestEventProvider';
import 'dotenv/config';

describe('mock event service', () => {
    const movieName = 'testMovie';
    let movie: TestMovieModel | null;

    /**
   * Setup MongoDB
   * Setup Kernel with test Console and Event provider
   */
    beforeAll(async () => {
        await Kernel.boot({
            ...testAppConfig,
            providers: [
                new DatabaseProvider(),
                new TestConsoleProvider(),
                new TestEventProvider()
            ]
        }, {});

        await testModelsHelper.cleanupCollections()
    });

    /**
   * After tests, check if the record was created
   * Clear out created records
   */
    afterAll(async () => {
        const repository = new Repository<TestMovieModel>('tests', TestMovieModel);
        movie = await repository.findOne({ name: movieName });
        expect(movie?.getId()).toBeTruthy();
        expect(movie?.getAttribute('name')).toBe(movieName);

        await movie?.delete();
        expect(movie?.data).toBeNull();
    });

    /**
   * Dispatches the TestQueueSubscriber event to the worker
   */
    test('dispatch a test event', (done) => {
        App.container('events').dispatch(new TestQueueSubscriber({ name: movieName }));
        done();
    });

    /**
   * Worker will run and create a record
   */
    test('run the worker command', async () => {
        await App.container('console').reader(['worker']).handle();
    });


});