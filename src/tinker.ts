import 'dotenv/config';
import 'tsconfig-paths/register';

import { App } from '@src/core/services/App';

import Model from './core/base/Model';
import { IEloquent } from './core/domains/eloquent/interfaces/IEloquent';
import TestPeopleModel, { ITestPeopleModelData, resetTable } from './tests/eloquent/models/TestPeopleModel';
import testHelper from './tests/testHelper';

class PersonModel extends Model<{ name: string, age: number, createdAt: Date, updatedAt: Date }> {

    table = 'tests'

    public fields: string[] = [
        'name',
        'age',
        'createdAt',
        'updatedAt'
    ]
    
}

(async () => {

    await testHelper.testBootApp();

    // const auth = App.container('auth');
    const db = App.container('db');
    // const events = App.container('events')
    // const express = App.container('express')                         
    // const cnsl = App.container('console');

    // Add your tinkers below

    App.container('logger').info('Tinkers are ready!')


    await resetTable();

    const query: IEloquent<ITestPeopleModelData> = TestPeopleModel.query()

    const results = await query.whereBetween('age', [30, 40]).get()

    console.log('=============================================================')
    console.log('Results', results)
    return;



    // const updates = await query.clone()
    //     .where('id', '=', inserts[0].id)
    //     .orWhere('id', '=', inserts[1].id)
    //     .update({
    //         name: 'John Doe Updated',
    //         age: 31
    //     });
        
    // console.log(updates)
    // return;

    
    // class PeopleModel extends Model<IModelAttributes> {}
    // class MoviesModel extends Model<IModelAttributes> {}
    // class BlogPost extends Model<IModelAttributes> {}
    // class CustomModel extends Model<IModelAttributes> {

    //     table: string = 'custom_table';
    
    // }

    // console.log({
    //     // people: (new PeopleModel(null)).useTableName(),
    //     // movies: (new MoviesModel(null)).useTableName(),
    //     // blogPost: (new BlogPost(null)).useTableName(),
    //     custom: (new CustomModel(null)).useTableName()
    // })
    // return;

        
    // console.log(results)

    // const results = await PersonModel.query()
    //     .select(['id', 'name', 'age'])
    //     .where('age', '>', 30)
    //     .where('age', '<', 40)
    //     .orderBy('age', 'desc')
    //     .skip(5)
    //     .take(3)
    //     .get()

    // console.log('found results', results.count())

    // for(const i in results) {
    //     console.log(i, results[i])
    // }


    // const query = SqlTestModel.query()
    //     .where('age', '>', 30)
    //     .where('age', '<', 40)

    // const results = await query.get()

    // console.log({query, results})
})(); 