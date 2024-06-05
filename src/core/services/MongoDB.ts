import { MongoClient, Db } from 'mongodb';
import IMongoDbConfig from '../interfaces/IMongoDbConfig';
import Singleton from '../base/Singleton';

export default class MongoDB extends Singleton<IMongoDbConfig> {
    private client: MongoClient;
    private db!: Db;

    constructor({ uri, options }: IMongoDbConfig) {
        super({ uri, options });
        this.client = new MongoClient(uri, options);
    }

    public async connect(): Promise<void> {
        await this.client.connect();
        this.db = this.client.db();
    }

    public getClient(): MongoClient {
        return this.client;
    }

    public getDb(): Db {
        return this.db;
    }
}