import BaseDatabaseSchema from "@src/core/domains/database/base/BaseDatabaseSchema";
import MongoDB from "@src/core/domains/database/providers-db/MongoDB";

class MongoDBSchema extends BaseDatabaseSchema {

    protected driver!: MongoDB;

    constructor(driver: MongoDB) {
        super(driver);
        this.driver = driver;
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

}

export default MongoDBSchema