import BaseSchema from "@src/core/domains/database/base/BaseSchema";
import CreateDatabaseException from "@src/core/domains/database/exceptions/CreateDatabaseException";
import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";
import MongoDbAdapter from "@src/core/domains/mongodb/adapters/MongoDbAdapter";
import { App } from "@src/core/services/App";

class MongoDBSchema extends BaseSchema implements IDatabaseSchema{

    protected adapter!: MongoDbAdapter;

    constructor(adapter: MongoDbAdapter) {
        super()
        this.adapter = adapter;
    }

    /**
     * Creates a new database schema.
     * @param name The name of the database to create
     * @returns A promise that resolves when the database schema has been created
     */
    async createDatabase(name: string): Promise<void> {
        const client = await this.adapter.getMongoClientWithDatabase('app')

        try {
            const db = client.db(name);
            
            await db.createCollection("_schema");
        
            await db.collection("_schema").insertOne({
                databaseName: name
            });
            
            const exists = await this.databaseExists(name);

            if (!exists) {
                throw new CreateDatabaseException(`Failed to create database ${name}`);
            }
        }
        catch (err) {
            throw new CreateDatabaseException(`Error creating database ${name}: ${(err as Error).message}`);
        }
        finally {
            await client.close();
        }
    }

    /**
     * Checks if a database exists
     * @param name The name of the database to check
     * @returns A promise that resolves to a boolean indicating whether the database exists
     */
    async databaseExists(name: string): Promise<boolean> {
        const client = await this.adapter.getMongoClientWithDatabase('app')

        try {
            const adminDb = client.db().admin()
            const dbList = await adminDb.listDatabases();
            return dbList.databases.some(db => db.name === name);
        }
        catch (err) {
            App.container('logger').error(err);
        }
        finally {
            client.close()
        }

        return false;
    }

    /**
     * Drops the specified database.
     * 
     * @param name - The name of the database to drop.
     * @returns A promise that resolves when the database has been dropped.
     */
    async dropDatabase(name: string): Promise<void> {
        const client = await this.adapter.getMongoClientWithDatabase('app');

        try {
            await client.db(name).dropDatabase();
        }
        catch (err) {
            App.container('logger').error(err);
        }
        finally {
            client.close()
        }
    }

    /**
     * Create a table
     * @param tableName 
     * @param args 
     */
    // eslint-disable-next-line no-unused-vars
    async createTable(tableName: string, ...args: any[]): Promise<void> {
        tableName = this.formatTableName(tableName);

        await this.adapter.getDb().createCollection(tableName);
        await this.adapter.getDb().collection(tableName).insertOne({
            _create_table: true
        });
        await this.adapter.getDb().collection(tableName).deleteMany({
            _create_table: true
        });
    }

    /**
     * Drop a table
     * @param tableName 
     * @param args 
     */
    // eslint-disable-next-line no-unused-vars
    async dropTable(tableName: string, ...args: any[]): Promise<void> {
        tableName = this.formatTableName(tableName);
        await this.adapter.getDb().dropCollection(tableName);
    }

    /**
     * Check if table exists
     * @param tableName 
     * @returns 
     */
    // eslint-disable-next-line no-unused-vars
    async tableExists(tableName: string, ...args: any[]): Promise<boolean> {
        tableName = this.formatTableName(tableName);
        return (await this.adapter.getDb().listCollections().toArray()).map(c => c.name).includes(tableName);
    }

    /**
     * Alter a table
     * @param name 
     * @param args 
     */
    // eslint-disable-next-line no-unused-vars
    alterTable(...args: any[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    /**
     * Drop all tables in the database
     *
     * @returns A promise resolving when all tables have been dropped
     */
    async dropAllTables(): Promise<void> {
        const mongoClient = this.adapter.getClient();
        const db = mongoClient.db();

        const collections = await db.listCollections().toArray();

        for(const collection of collections) {
            await db.dropCollection(collection.name);
        }

    }

}

export default MongoDBSchema