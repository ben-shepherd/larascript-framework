import { describe, expect, test } from '@jest/globals';
import testAppConfig from '@src/config/test';
import Kernel from '@src/core/Kernel';
import MongoDBProvider from '@src/core/providers/MongoDBProvider';
import { AuthorModel } from '@src/tests/models/Author';
import { MovieModel } from '@src/tests/models/Movie';

describe('test belongsTo by fetching an author from a movie', () => {
    test('kernal boot', async () => {
        await Kernel.boot({
            ...testAppConfig,
            providers: [
                new MongoDBProvider()
            ]
        }, {})
    })

    let authorModel: AuthorModel;
    let movieModel: MovieModel;

    test('create author model', async () => {
        authorModel = new AuthorModel({
            name: 'authorName'
        })
        await authorModel.save();
        expect(authorModel.getId()).toBeTruthy();
    });


    test('create movie model', async () => {
        movieModel = new MovieModel({
            authorId: authorModel.getId()?.toString() as string,
            name: 'Movie One'
        })
        await movieModel.save();
        expect(movieModel.getId()).toBeTruthy();
    })

    test('get related author from movie', async () => {
        const relatedAuthor = await movieModel.author();
        expect(relatedAuthor).toBeInstanceOf(AuthorModel);
        expect(relatedAuthor?.getId()).toEqual(authorModel.getId());
    })

    test('get related author from movie with additional filters', async () => {
        const relatedAuthor = await movieModel.authorByName('authorName');
        expect(relatedAuthor).toBeInstanceOf(AuthorModel);
        expect(relatedAuthor?.getId()).toEqual(authorModel.getId());
    })

    test('clean up created cecords', async () => {
        await movieModel.delete()
        expect(movieModel.data).toBeNull();

        await authorModel.delete();
        expect(authorModel.data).toBeNull();
    });
});