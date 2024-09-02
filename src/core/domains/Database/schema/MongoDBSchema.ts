import DatabaseSchema from "@src/core/domains/database/base/DatabaseSchema";
import MongoDB from "@src/core/domains/database/providers-db/MongoDB";

class MongoDBSchema extends DatabaseSchema
{
    protected driver!: MongoDB;

    constructor(driver: MongoDB) {
        super(driver);
        this.driver = driver;
    }

    createTable(name: string, ...args: any[]): void {
        this.driver.getDb().createCollection(name);
    }

    dropTable(name: string, ...args: any[]): void {
        this.driver.getDb().dropCollection(name);
    }
}

export default MongoDBSchema