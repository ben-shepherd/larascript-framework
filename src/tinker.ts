import 'dotenv/config';
import 'tsconfig-paths/register';

import appConfig from '@src/config/app';
import Kernel from "@src/core/Kernel";
import { App } from '@src/core/services/App';

import Model from './core/base/Model';
import SqlExpressionBuilder from './core/domains/postgres/builder/ExpressionBuilder/SqlExpressionBuilder';


class SqlTestModel extends Model<{ name: string, age: number, createdAt: Date, updatedAt: Date }> {

    table = 'tests'

    public fields: string[] = [
        'name',
        'age',
        'createdAt',
        'updatedAt'
    ]
    
}

(async () => {

    await Kernel.boot(appConfig, {})

    // const auth = App.container('auth');
    const db = App.container('db');
    // const events = App.container('events')
    // const express = App.container('express')                         
    // const cnsl = App.container('console');

    // Add your tinkers below

    App.container('logger').info('Tinkers are ready!')

    // const bindingsHelper = new BindingsHelper();
    // bindingsHelper.addBindings(1)

    // console.log(
    //     bindingsHelper.valuesToPlaceholderSqlArray([10,15,20]) // expect [$2, $3, $4]
    // )
    // console.log(bindingsHelper.getBindings())

    // bindingsHelper.addBinding(1);
    // bindingsHelper.addBinding('hello world');
    // bindingsHelper.addBinding(new Date());

    // await db.schema().dropTable('tests');
    // await db.schema().createTable('tests', {
    //     name: DataTypes.STRING,
    //     age: DataTypes.INTEGER,
    //     createdAt: DataTypes.DATE,
    //     updatedAt: DataTypes.DATE
    // })

    // await db.documentManager().table('tests').insertMany([
    //     {
    //         name: 'Alice',
    //         age: 30,
    //         createdAt: new Date(),
    //         updatedAt: new Date()
    //     },
    //     {
    //         name: 'Ben',
    //         age: 40,
    //         createdAt: new Date(),
    //         updatedAt: new Date()
    //     },
    //     {
    //         name: 'Charlie',
    //         age: 50,
    //         createdAt: new Date(),
    //         updatedAt: new Date()
    //     }
    // ])

    const b = new SqlExpressionBuilder();
    // const id = 1

    // const builder = b.setTable('tests', 't')
    //     // .setColumns(['name', 'age'])
    //     .where('id', '=', id)
    //     .setOrderBy([{ column: 'age', direction: 'asc' }, { column: 'name', direction: 'desc' }])
    //     .setJoins([
    //         {
    //             type: 'inner',
    //             table: 'users',
    //             tableAbbreviation: 'u',
    //             leftColumn: 't.id',
    //             rightColumn: 'u.id'
    //         }
    //     ])
    //     .setOffset({ offset: 1, limit: 2 })

    // console.log('====================================================')
    // console.log({sql: builder.toSql(    ), bindings: builder.getBindings()})
    console.log('====================================================')
    // const result = await SqlTestModel.query().find('78ab4059-83d9-4af4-b356-8cf355af943c')

    const results = await SqlTestModel.query()
        .where('age', '>', 30)
        .where('age', '<', 40)
        .orderBy('age', 'desc')
        .get()

    console.log('found results', results.count())


    console.log(await results[0].toObject())

    // const query = SqlTestModel.query()
    //     .where('age', '>', 30)
    //     .where('age', '<', 40)

    // const results = await query.get()

    // console.log({query, results})
})(); 