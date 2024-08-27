import { describe, expect, test } from '@jest/globals';
import Kernel from '@src/core/Kernel';
import DatabaseProvider from '@src/core/domains/database/providers/DatabaseProvider';
import testAppConfig from '@src/tests/config/testConfig';
import { TestAuthorModel } from '@src/tests/models/models/TestAuthor';
import { TestMovieModel } from '@src/tests/models/models/TestMovie';
import testModelsHelper from '@src/tests/models/testModelsHelper';

describe('test hasMany by movies from an author', () => {

    /**
     * Boot the MongoDB provider
     */
    beforeAll(async () => {
        await Kernel.boot({
            ...testAppConfig,
            providers: [
                new DatabaseProvider()
            ]
        }, {})

        await testModelsHelper.cleanupCollections()
    })
    
    let authorModel: TestAuthorModel;
    let movieModelOne: TestMovieModel;
    let movieModelTwo: TestMovieModel;

    /**
     * Create author model
     */
    test('create author model', async () => {
        authorModel = new TestAuthorModel({
            name: 'authorName'
        })
        await authorModel.save();
        expect(authorModel.getId()).toBeTruthy();
    });

    /**
     * Create movie model one and two
     */
    test('create movie model', async () => {
        movieModelOne = new TestMovieModel({
            authorId: authorModel.getId()?.toString() as string,
            name: 'Movie One',
            yearReleased: '1970'
        })
        await movieModelOne.save();
        expect(movieModelOne.getId()).toBeTruthy();

        movieModelTwo = new TestMovieModel({
            authorId: authorModel.getId()?.toString() as string,
            name: 'Movie Two',
            yearReleased: '1980'
        })
        await movieModelTwo.save();
        expect(movieModelTwo.getId()).toBeTruthy();
    })

    /**
     * Get related movies from author
     */
    test('get related movies from author', async () => {
        const movies = await authorModel.movies();
        expect(movies.length).toEqual(2);
        expect(movies[0].data?.name).toEqual(movieModelOne.data?.name);
        expect(movies[1].data?.name).toEqual(movieModelTwo.data?.name);
    })

    /**
     * Get related movies from author from year 1970
     */
    test('get related movies from author from year 1970', async () => {
        const movies = await authorModel.moviesFromYear(1970);
        expect(movies.length).toEqual(1);
        expect(movies[0].data?.name).toEqual(movieModelOne.data?.name);
    })
});