import { App } from "@src/core/services/App";

import MongoDbAdapter from "../../mongodb/adapters/MongoDbAdapter";

/**
 * Creates the migrations schema for MongoDB
 *
 * @returns {Promise<void>}
 */
const createMongoDBSchema = async (tableName: string = 'migrations') => {
    const db = App.container('db').getAdapter<MongoDbAdapter>().getDb();

    if ((await db.listCollections().toArray()).map(c => c.name).includes(tableName)) {
        return;
    }

    await db.createCollection(tableName);
}

export default createMongoDBSchema