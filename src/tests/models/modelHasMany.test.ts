import { describe, expect, test } from '@jest/globals';
import testAppConfig from '@src/config/test';
import Kernel from '@src/core/Kernel';
import MongoDBProvider from '@src/core/providers/MongoDBProvider';
import { AuthorModel } from '@src/tests/models/models/Author';
import { MovieModel } from '@src/tests/models/models/Movie';

describe('test hasMany by movies from an author', () => {
    test('kernel boot', async () => {
        await Kernel.boot({
            ...testAppConfig,
            providers: [
                new MongoDBProvider()
            ]
        }, {})
    })

    let authorModel: AuthorModel;
    let movieModelOne: MovieModel;
    let movieModelTwo: MovieModel;

    test('create author model', async () => {
        authorModel = new AuthorModel({
            name: 'authorName'
        })
        await authorModel.save();
        expect(authorModel.getId()).toBeTruthy();
    });


    test('create movie model', async () => {
        movieModelOne = new MovieModel({
            authorId: authorModel.getId()?.toString() as string,
            name: 'Movie One',
            yearReleased: '1970'
        })
        await movieModelOne.save();
        expect(movieModelOne.getId()).toBeTruthy();

        movieModelTwo = new MovieModel({
            authorId: authorModel.getId()?.toString() as string,
            name: 'Movie Two',
            yearReleased: '1980'
        })
        await movieModelTwo.save();
        expect(movieModelTwo.getId()).toBeTruthy();
    })

    test('get related movies from author', async () => {
        const movies = await authorModel.movies();
        expect(movies.length).toEqual(2);
        expect(movies[0].data?.name).toEqual(movieModelOne.data?.name);
        expect(movies[1].data?.name).toEqual(movieModelTwo.data?.name);
    })

    test('get related movies from author from year 1970', async () => {
        const movies = await authorModel.moviesFromYear(1970);
        expect(movies.length).toEqual(1);
        expect(movies[0].data?.name).toEqual(movieModelOne.data?.name);
    })

    test('clean up created cecords', async () => {
        await movieModelOne.delete()
        expect(movieModelOne.data).toBeNull();

        await movieModelTwo.delete()
        expect(movieModelTwo.data).toBeNull();

        await authorModel.delete();
        expect(authorModel.data).toBeNull();
    });
});