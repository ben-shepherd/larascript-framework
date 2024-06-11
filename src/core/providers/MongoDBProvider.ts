import BaseProvider from "../base/Provider";
import MongoDB from "../domains/database/services/MongoDB";
import IMongoDbConfig from "../interfaces/IMongoDbConfig";
import Kernel from "../kernel";

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
    }

    public async boot(): Promise<void>
    {
        this.log('Booting MongoDBProvider');

        await MongoDB.getInstance(this.config).connectDefaultConnection();
        await MongoDB.getInstance().connectKeepAlive()
        Kernel.getInstance().setContainer('mongodb', MongoDB.getInstance().getConnection())
    }
}