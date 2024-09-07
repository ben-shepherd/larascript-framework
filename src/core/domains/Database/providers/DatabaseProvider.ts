import databaseConfig from '@src/config/database';
import BaseProvider from "@src/core/base/Provider";
import { IDatabaseConfig } from '@src/core/domains/database/interfaces/IDatabaseConfig';
import DatabaseService from '@src/core/domains/database/services/DatabaseService';
import { App } from "@src/core/services/App";

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
    }
}