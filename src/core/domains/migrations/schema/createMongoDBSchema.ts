import MongoDB from "@src/core/domains/database/providers-db/MongoDB";
import { App } from "@src/core/services/App";

/**
 * Creates the migrations schema for MongoDB
 *
 * @returns {Promise<void>}
 */
const createMongoDBSchema = async (tableName: string = 'migrations') => {
    const db = App.container('db').provider<MongoDB>().getDb();

    if ((await db.listCollections().toArray()).map(c => c.name).includes(tableName)) {
        return;
    }

    await db.createCollection(tableName);
}

export default createMongoDBSchema