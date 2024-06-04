import { MongoClient, Db } from 'mongodb';
import IMongoDbConfig from '../interfaces/IMongoDbConfig';

export default class MongoDB {
    private static instance: MongoDB;
    private client: MongoClient;
    private db!: Db;

    private constructor({ uri, options }: IMongoDbConfig) {
        this.client = new MongoClient(uri, options);
    }

    public static getInstance(config: IMongoDbConfig | null = null): MongoDB {
        if (!MongoDB.instance && config) {
            MongoDB.instance = new MongoDB(config);
        }

        if (!MongoDB.instance) {
            throw new Error('MongoDB instance not created');
        }

        return MongoDB.instance;
    }

    public async connect(): Promise<void> {
        await this.client.connect();
        this.db = this.client.db(); // This will use the database specified in the connection string
    }

    public getDatabase(): Db {
        return this.db;
    }
}
