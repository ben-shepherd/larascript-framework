import MongoDB from "@src/core/domains/database/providers-db/MongoDB";
import { App } from "@src/core/services/App";

/**
 * Creates the migrations schema for MongoDB
 *
 * @returns {Promise<void>}
 */
const createMongoDBSchema = async () => {
    const db = App.container('db').provider<MongoDB>().getDb();

    if ((await db.listCollections().toArray()).map(c => c.name).includes('migrations')) {
        return;
    }

    await db.createCollection('migrations');
}

export default createMongoDBSchema