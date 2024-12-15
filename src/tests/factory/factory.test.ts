/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import TestMovieFactory from '@src/tests/factory/TestMovieFakerFactory';
import testHelper from '@src/tests/testHelper';

describe('create a movie model using factories', () => {


    beforeAll(async () => {
        await testHelper.testBootApp()
    });


    test('create a movie', async () => {
        const factory = new TestMovieFactory();
        const movie = factory.createFakeMovie();

        expect(movie).toBeTruthy();
        expect(typeof movie.getAttributeSync('authorId') === 'string').toEqual(true);
        expect(typeof movie.getAttributeSync('name') === 'string').toEqual(true);
        expect(typeof movie.getAttributeSync('yearReleased') === 'number').toEqual(true);
        expect(movie.getAttributeSync('createdAt') instanceof Date).toEqual(true);
        expect(movie.getAttributeSync('updatedAt') instanceof Date).toEqual(true);
    });
});