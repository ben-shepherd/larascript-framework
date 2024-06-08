import IMongoDbConfig from "../interfaces/IMongoDbConfig";
import MongoDB from "../domains/Database/Services/MongoDB";
import Provider from "../base/Provider";

export default class MongoDBProvider extends Provider
{
    protected configPath: string = 'src/config/database/mongodb';
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

        await MongoDB.getInstance(this.config).connectAll();
        
        this.log('Database connected successfully');
    }
}