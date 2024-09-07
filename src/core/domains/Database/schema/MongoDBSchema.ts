import DatabaseSchema from "@src/core/domains/database/base/DatabaseSchema";
import MongoDB from "@src/core/domains/database/providers-db/MongoDB";

class MongoDBSchema extends DatabaseSchema {

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
    async createTable(name: string, ...args: any[]): Promise<void> {
        this.driver.getDb().createCollection(name);
    }

    /**
     * Drop a table
     * @param name 
     * @param args 
     */
    async dropTable(name: string, ...args: any[]): Promise<void> {
        await this.driver.getDb().dropCollection(name);
    }

    /**
     * Check if table exists
     * @param name 
     * @returns 
     */
    async tableExists(name: string): Promise<boolean> {
        return (await this.driver.getDb().listCollections().toArray()).map(c => c.name).includes(name);
    }

}

export default MongoDBSchema