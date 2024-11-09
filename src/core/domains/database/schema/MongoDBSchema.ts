import BaseDatabaseSchema from "@src/core/domains/database/base/BaseDatabaseSchema";
import MongoDB from "@src/core/domains/database/providers-db/MongoDB";

class MongoDBSchema extends BaseDatabaseSchema {

    protected driver!: MongoDB;

    constructor(driver: MongoDB) {
        super(driver);
        this.driver = driver;
    }

    /**
     * Creates a new database schema.
     * @param name The name of the database to create
     * @returns A promise that resolves when the database schema has been created
     */
    async createDatabase(name: string): Promise<void> {
        await this.driver.getClient().db(name).createCollection("schema");
    }

    /**
     * Checks if a database exists
     * @param name The name of the database to check
     * @returns A promise that resolves to a boolean indicating whether the database exists
     */
    async databaseExists(name: string): Promise<boolean> {
        const adminDb = this.driver.getClient().db().admin();
        const dbList = await adminDb.listDatabases();
        return dbList.databases.some(db => db.name === name);
    }

    /**
     * Drops the specified database.
     * 
     * @param name - The name of the database to drop.
     * @returns A promise that resolves when the database has been dropped.
     */
    async dropDatabase(name: string): Promise<void> {
        const client = this.driver.getClient();
        await client.db(name).dropDatabase();
    }

    /**
     * Create a table
     * @param name 
     * @param args 
     */
    // eslint-disable-next-line no-unused-vars
    async createTable(name: string, ...args: any[]): Promise<void> {
        this.driver.getDb().createCollection(name);
    }

    /**
     * Drop a table
     * @param name 
     * @param args 
     */
    // eslint-disable-next-line no-unused-vars
    async dropTable(name: string, ...args: any[]): Promise<void> {
        await this.driver.getDb().dropCollection(name);
    }

    /**
     * Check if table exists
     * @param name 
     * @returns 
     */
    // eslint-disable-next-line no-unused-vars
    async tableExists(name: string, ...args: any[]): Promise<boolean> {
        return (await this.driver.getDb().listCollections().toArray()).map(c => c.name).includes(name);
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
        const mongoClient = this.driver.getClient();
        const db = mongoClient.db();

        const collections = await db.listCollections().toArray();

        for(const collection of collections) {
            await db.dropCollection(collection.name);
        }

    }

}

export default MongoDBSchema