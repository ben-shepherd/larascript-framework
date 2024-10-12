/* eslint-disable no-undef */
import { describe, expect, test } from '@jest/globals';
import Kernel from '@src/core/Kernel';
import { App } from '@src/core/services/App';
import testAppConfig from '@src/tests/config/testConfig';
import { getTestConnectionNames } from '@src/tests/config/testDatabaseConfig';
import { TestAuthorModel } from '@src/tests/models/models/TestAuthor';
import { TestMovieModel } from '@src/tests/models/models/TestMovie';
import TestDatabaseProvider from '@src/tests/providers/TestDatabaseProvider';
import { DataTypes } from 'sequelize';

const connections = getTestConnectionNames()

const createTable = async (connectionName: string) => {
    const schema = App.container('db').schema(connectionName)

    schema.createTable('tests', {
        name: DataTypes.STRING,
        authorId: DataTypes.STRING,
        yearReleased: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    })
}

const dropTable = async (connectionName: string) => {
    const schema = App.container('db').schema(connectionName)

    if(await schema.tableExists('tests')) {
        await schema.dropTable('tests');
    }
}

const truncate = async (connectionName: string) => {
    await App.container('db').documentManager(connectionName).table('tests').truncate()
}

describe('test hasMany', () => {

    /**
     * Boot the MongoDB provider
     */
    beforeAll(async () => {
        await Kernel.boot({
            ...testAppConfig,
            providers: [
                new TestDatabaseProvider()
            ]
        }, {})

        for(const connection of connections) {
            await dropTable(connection)
            await createTable(connection)
        }
    })
    
    test('hasMany', async () => {
        for(const connectionName of connections) {
            App.container('logger').info('[Connection]', connectionName)
            App.container('db').setDefaultConnectionName(connectionName);

            await truncate(connectionName);

            /**
             * Create author model
             */
            const authorModel = new TestAuthorModel({
                name: 'John'
            })
            await authorModel.save();
            expect(typeof authorModel.getId() === 'string').toBe(true)
            expect(authorModel.data?.name).toEqual('John');
    
            /**
             * Create movie model one and two
             */
            const movieModelOne = new TestMovieModel({
                authorId: authorModel.getId()?.toString() as string,
                name: 'Movie One',
                yearReleased: 1970
            })
            await movieModelOne.save();
            expect(typeof movieModelOne.getId() === 'string').toBe(true);
            expect(movieModelOne.data?.name).toEqual('Movie One');
            expect(movieModelOne.data?.yearReleased).toEqual(1970);
    
            const movieModelTwo = new TestMovieModel({
                authorId: authorModel.getId()?.toString() as string,
                name: 'Movie Two',
                yearReleased: 1980
            })
            await movieModelTwo.save();
            expect(typeof movieModelTwo.getId() === 'string').toBe(true);
            expect(movieModelTwo.data?.name).toEqual('Movie Two');
            expect(movieModelTwo.data?.yearReleased).toEqual(1980);
    
            /**
             * Get related movies from author
             */
            const relatedMovies = await authorModel.movies();
            expect(relatedMovies.length).toEqual(2);
            expect(relatedMovies.find((m) => m.data?.name === movieModelOne.data?.name)).toBeTruthy()
            expect(relatedMovies.find((m) => m.data?.name === movieModelTwo.data?.name)).toBeTruthy()

            /**
             * Get related movies from author from year 1970
             */
            const relatedMoviesWithFilters = await authorModel.moviesFromYear(1970);
            expect(relatedMoviesWithFilters.length).toEqual(1);
            expect(relatedMovies.find((m) => m.data?.name === movieModelOne.data?.name)).toBeTruthy()
        }
    })
});