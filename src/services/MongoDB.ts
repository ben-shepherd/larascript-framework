import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const connectionString: string = process.env.MONGO_CONNECTION_STRING as string;

export default class MongoDB {
    private static instance: MongoDB;
    private client: MongoClient;
    private db!: Db;

    private constructor() {
        this.client = new MongoClient(connectionString);
    }

    public static getInstance(): MongoDB {
        if (!MongoDB.instance) {
            MongoDB.instance = new MongoDB();
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
