import { describe, expect, test } from '@jest/globals';
import testAppConfig from '@src/config/test';
import Kernel from '@src/core/Kernel';
import MongoDBProvider from '@src/core/providers/MongoDBProvider';
import { TestAuthorModel } from '@src/tests/models/models/TestAuthor';
import { TestMovieModel } from '@src/tests/models/models/TestMovie';

describe('test belongsTo by fetching an author from a movie', () => {
    beforeAll(async () => {
        await Kernel.boot({
            ...testAppConfig,
            providers: [
                new MongoDBProvider()
            ]
        }, {})
    })

    let authorModel: TestAuthorModel;
    let movieModel: TestMovieModel;

    afterAll(async () => {
        await movieModel.delete()
        expect(movieModel.data).toBeNull();

        await authorModel.delete();
        expect(authorModel.data).toBeNull();
    });

    test('create author model', async () => {
        authorModel = new TestAuthorModel({
            name: 'authorName'
        })
        await authorModel.save();
        expect(authorModel.getId()).toBeTruthy();
    });


    test('create movie model', async () => {
        movieModel = new TestMovieModel({
            authorId: authorModel.getId()?.toString() as string,
            name: 'Movie One'
        })
        await movieModel.save();
        expect(movieModel.getId()).toBeTruthy();
    })

    test('get related author from movie', async () => {
        const relatedAuthor = await movieModel.author();
        expect(relatedAuthor).toBeInstanceOf(TestAuthorModel);
        expect(relatedAuthor?.getId()).toEqual(authorModel.getId());
    })

    test('get related author from movie with additional filters', async () => {
        const relatedAuthor = await movieModel.authorByName('authorName');
        expect(relatedAuthor).toBeInstanceOf(TestAuthorModel);
        expect(relatedAuthor?.getId()).toEqual(authorModel.getId());
    })
});