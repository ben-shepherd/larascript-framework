import { MongoClient, Db } from 'mongodb';
import IMongoDbConfig from '../../../interfaces/IMongoDbConfig';
import Singleton from '../../../base/Singleton';
import MongoDBConnection from './MongoDBInstance';

interface Connections {
    [key: string]: MongoDBConnection
}

export default class MongoDB<TConnection extends string = 'default'> extends Singleton<IMongoDbConfig> {
    private __connnection: string = 'default'
    private connections: Connections = {} as Connections;

    constructor(config: IMongoDbConfig) {
        super(config);
        this.__connnection = config.connection;
        this.init()
    }

    public init(): void
    {
        const config = this.getConfig();

        for(const conn of Object.keys(config?.connections ?? {})) {
            if(!config?.connections[conn]) {
                continue;
            }
            this.connections[conn] = new MongoDBConnection(config.connections[conn]);
        }
    }

    public getConnection(connection: TConnection = this.__connnection as TConnection): MongoDBConnection {
        return this.connections[connection];
    }

    public async connect(): Promise<void> {
        console.log('MongoDB connect', this.connections)

        for(const conn of Object.keys(this.connections)) {
            await this.connections[conn].connect();
            console.log('[Database][Connection: ' + conn + '] Connected successfully');
        }
    }

    public getClient(connection: TConnection = this.__connnection as TConnection): MongoClient {
        return this.getConnection(connection)?.getClient()
    }

    public getDb(connection: TConnection = this.__connnection as TConnection): Db {
        return this.getConnection(connection).getDb();
    }
}