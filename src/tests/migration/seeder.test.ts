/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { db } from '@src/core/domains/database/services/Database';
import { queryBuilder } from '@src/core/domains/eloquent/services/EloquentQueryBuilderService';
import IModelAttributes from "@src/core/interfaces/IModel";
import Model from '@src/core/models/base/Model';
import { app } from '@src/core/services/App';
import TestMigrationModel from '@src/tests/migration/models/TestMigrationModel';
import testHelper from '@src/tests/testHelper';
import { DataTypes } from 'sequelize';

export interface SeederTestModelAttributes extends IModelAttributes {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export class SeederTestModel extends Model<SeederTestModelAttributes> {

    public table: string = 'seeder_test';

    public fields: string[] = [
        'name',
        'createdAt',
        'updatedAt'
    ]

}

const resetTable = async () => {
    for(const connectionName of testHelper.getTestConnectionNames()) {
        const schema = db().schema(connectionName)

        // Drop migration
        if(await schema.tableExists(TestMigrationModel.getTable())) { 
            await schema.dropTable(TestMigrationModel.getTable());
        }

        const tableName = SeederTestModel.getTable()

        if(await schema.tableExists(tableName)) {
            await schema.dropTable(tableName);
        }
    
        await schema.createTable(tableName, {
            name: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        });
    }
}

describe('test seeders', () => {

    beforeAll(async () => {
        await testHelper.testBootApp()
    });

    test('test up seeder', async () => {

        // await dropAndCreateMigrationSchema()
        await resetTable()

        for(const connectionName of testHelper.getTestConnectionNames()) {
            const schema = db().schema(connectionName)

            await app('console').reader(['db:seed', '--group=testing', '--file=test-seeder-model']).handle();

            const tableExists = await schema.tableExists(SeederTestModel.getTable());
            expect(tableExists).toBe(true);

            const john = await queryBuilder(SeederTestModel).where('name', 'John').firstOrFail();
            expect(john?.name).toEqual('John');
        
            const jane = await queryBuilder(SeederTestModel).where('name', 'Jane').firstOrFail();
            expect(jane?.name).toEqual('Jane');
        }

    });

});