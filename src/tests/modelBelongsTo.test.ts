import { describe, expect, test } from '@jest/globals';
import testAppConfig from '@src/config/test';
import Model from '@src/core/base/Model';
import Kernel from '@src/core/Kernel';
import MongoDBProvider from '@src/core/providers/MongoDBProvider';

type MovieModelData = {
    authorId: string;
}
class MovieModel extends Model<MovieModelData> {
    public collection: string = 'tests';

    public fields: string[] = [
        'authorId',
        'createdAt',
        'updatedAt'
    ]

    public async author(): Promise<AuthorModel | null> {
        return this.belongsTo({
            localKey: 'authorId',
            localModel: this,
            foreignKey: '_id',
            foreignModelCtor: AuthorModel
        })
    }
}

type AuthorModelData = {
    name: string
}
class AuthorModel extends Model<AuthorModelData> {
    public collection: string = 'tests';

    public fields: string[] = [
        'createdAt',
        'updatedAt'
    ]
}


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
            authorId: authorModel.getId()?.toString() as string
        })
        await movieModel.save();
        expect(movieModel.getId()).toBeTruthy();
    })

    test('get related author from movie', async () => {
        const relatedAuthor = await movieModel.author();
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