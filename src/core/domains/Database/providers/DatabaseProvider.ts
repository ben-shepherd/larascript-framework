import databaseConfig from '@src/config/database';
import BaseProvider from "@src/core/base/Provider";
import { IDatabaseConfig } from '@src/core/domains/database/interfaces/IDatabaseConfig';
import { App } from "@src/core/services/App";
import DatabaseService from '@src/core/domains/database/services/DatabaseService';

export default class DatabaseProvider extends BaseProvider
{
    protected config: IDatabaseConfig = databaseConfig;

    public async register(): Promise<void>
    {
        this.log('Registering DatabaseProvider');

        const db = new DatabaseService(this.config);
        await db.boot();
        App.setContainer('db', db)
    }

    public async boot(): Promise<void>
    {
        this.log('Booting DatabaseProvider');

        //await this.bootMongoDB();
        //await this.bootPostgres();
    }

    /**
     * Provide MongoDB Service
     */
    public async bootMongoDB()
    {
        // const mongodb = App.container('mongodb');
        // mongodb.init();
        // await mongodb.connectDefaultConnection();
        // await mongodb.connectKeepAlive()
    }

    /**
     * Provide Postgres Service
     */
    public async bootPostgres()
    {

    }
}