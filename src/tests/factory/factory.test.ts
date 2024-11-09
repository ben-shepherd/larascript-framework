/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import TestMovieFactory from '@src/tests/factory/TestMovieFakerFactory';

import testHelper from '../testHelper';

describe('create a movie model using factories', () => {


    beforeAll(async () => {
        await testHelper.testBootApp()
    });


    test('create a movie', async () => {
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