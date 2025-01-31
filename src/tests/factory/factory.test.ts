/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import testHelper from '@src/tests/testHelper';

import { TestMovieModel } from '../models/models/TestMovie';

describe('create a movie model using factories', () => {


    beforeAll(async () => {
        await testHelper.testBootApp()
    });


    test('create a movie', async () => {
        const movie = TestMovieModel.make();

        expect(movie).toBeTruthy();
        expect(typeof movie.getAttributeSync('authorId') === 'string').toEqual(true);
        expect(typeof movie.getAttributeSync('name') === 'string').toEqual(true);
        expect(typeof movie.getAttributeSync('yearReleased') === 'number').toEqual(true);
        expect(movie.getAttributeSync('createdAt') instanceof Date).toEqual(true);
        expect(movie.getAttributeSync('updatedAt') instanceof Date).toEqual(true);
    });

    test('create a movie with data', async () => {
        const movie = TestMovieModel.make({
            authorId: '1',
            name: 'Test Movie',
            yearReleased: 2024,
        });

        expect(movie).toBeTruthy();
        expect(movie.getAttributeSync('authorId') === '1').toEqual(true);
        expect(movie.getAttributeSync('name') === 'Test Movie').toEqual(true);
        expect(movie.getAttributeSync('yearReleased') === 2024).toEqual(true);
        expect(movie.getAttributeSync('createdAt') instanceof Date).toEqual(true);
        expect(movie.getAttributeSync('updatedAt') instanceof Date).toEqual(true);

    });

});