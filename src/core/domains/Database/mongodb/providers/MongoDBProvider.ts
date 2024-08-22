import databaseConfig from '@src/config/database';
import BaseProvider from "@src/core/base/Provider";
import MongoDB from "@src/core/domains/database/mongodb/services/MongoDB";
import { App } from "@src/core/services/App";
import { IDatabaseConfig } from '@src/core/domains/database/interfaces/IDatabaseConfig';

export default class MongoDBProvider extends BaseProvider
{
    protected config: IDatabaseConfig = databaseConfig;

    public async register(): Promise<void>
    {
        this.log('Registering MongoDBProvider');
        
        App.setContainer('mongodb', new MongoDB(this.config.mongodb))
    }

    public async boot(): Promise<void>
    {
        this.log('Booting MongoDBProvider');

        const mongodb = App.container('mongodb');
        mongodb.init();
        await mongodb.connectDefaultConnection();
        await mongodb.connectKeepAlive()
    }
}