/* eslint-disable no-undef */
import { describe, expect, test } from '@jest/globals';
import { App } from '@src/core/services/App';
import { TestAuthorModel } from '@src/tests/models/models/TestAuthor';
import { TestMovieModel } from '@src/tests/models/models/TestMovie';
import testHelper from '@src/tests/testHelper';
import { DataTypes } from 'sequelize';

const tableName = 'tests';

const connections = testHelper.getTestConnectionNames()

const createTable = async (connectionName: string) => {
    const schema = App.container('db').schema(connectionName);
    await schema.createTable(tableName, {
        name: DataTypes.STRING,
        born: DataTypes.INTEGER,
        authorId: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    });
};

const dropTable = async (connectionName: string) => {
    try {
        const schema = App.container('db').schema(connectionName);
        await schema.dropTable(tableName);
    }
    // eslint-disable-next-line no-unused-vars
    catch (err) {}
}

const truncate = async (connectionName: string) => {
    const schema = App.container('db').documentManager(connectionName).table(tableName);
    await schema.truncate();
}

describe('test belongsTo by fetching an author from a movie', () => {
    beforeAll(async () => {
        await testHelper.testBootApp()
    })

    /**
     * Create author model
     */
    test('belongsTo', async () => {

        for(const connectionName of connections) {
            App.container('logger').info('[Connection]', connectionName)

            await dropTable(connectionName)
            await createTable(connectionName)

            App.container('db').setDefaultConnectionName(connectionName)
            
            await truncate(connectionName)

            /**
             * Create an author
             */
            const authorModel = new TestAuthorModel({
                name: 'authorName'
            })
            await authorModel.save();
            expect(typeof authorModel.getId() === 'string').toBe(true)

            /**
             * Create related movie
             */
            const movieModel = new TestMovieModel({
                authorId: authorModel.getId() as string,
                name: 'Movie One'
            })
            await movieModel.save();
            expect(typeof movieModel.getId() === 'string').toBe(true)

            /**
             * Find related author
             */
            const relatedAuthor = await movieModel.author();
            expect(relatedAuthor).toBeInstanceOf(TestAuthorModel);
            expect(typeof relatedAuthor?.getId() === 'string').toBe(true);
            expect(relatedAuthor?.getId()).toEqual(authorModel.getId());

            /**
             * Find related author with filters
             */
            const relatedAuthorWithFilters = await movieModel.authorByName('authorName');
            expect(relatedAuthorWithFilters).toBeInstanceOf(TestAuthorModel);
            expect(typeof relatedAuthorWithFilters?.getId() === 'string').toBe(true);
            expect(relatedAuthorWithFilters?.getId()).toEqual(authorModel.getId());
        }
    });

});