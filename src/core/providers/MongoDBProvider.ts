import BaseProvider from "../base/Provider";
import IMongoDbConfig from "../domains/database/mongodb/interfaces/IMongoDbConfig";
import MongoDB from "../domains/database/mongodb/services/MongoDB";
import { App } from "../services/App";

export default class MongoDBProvider extends BaseProvider
{
    protected configPath: string = '@config/database/mongodb';
    protected config!: IMongoDbConfig;

    constructor() {
        super();
        this.init()
    }

    public async register(): Promise<void>
    {
        this.log('Registering MongoDBProvider');

        MongoDB.getInstance(this.config)
    }

    public async boot(): Promise<void>
    {
        this.log('Booting MongoDBProvider');

        const mongodb = MongoDB.getInstance()
        await mongodb.connectDefaultConnection();
        await mongodb.connectKeepAlive()
        App.setContainer('mongodb', mongodb)
    }
}