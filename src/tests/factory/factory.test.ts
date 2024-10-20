/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import Kernel from '@src/core/Kernel';
import testAppConfig from '@src/tests/config/testConfig';

import TestDatabaseProvider from '../providers/TestDatabaseProvider';
import TestMovieFactory from './TestMovieFaker';

describe('test migrations', () => {


    beforeAll(async () => {
        await Kernel.boot({
            ...testAppConfig,
            providers: [
                ...testAppConfig.providers,
                new TestDatabaseProvider()
            ]
        }, {})


    });


    test('test factory', async () => {
        const factory = new TestMovieFactory();
        const movie = factory.createFakeMovie();

        expect(movie).toBeTruthy();
        expect(typeof movie.getAttribute('authorId') === 'string').toEqual(true);
        expect(typeof movie.getAttribute('name') === 'string').toEqual(true);
        expect(typeof movie.getAttribute('yearReleased') === 'number').toEqual(true);
        expect(movie.getAttribute('createdAt') instanceof Date).toEqual(true);
        expect(movie.getAttribute('updatedAt') instanceof Date).toEqual(true);
    });
});