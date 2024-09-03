import { App } from "@src/core/services/App";
import MongoDB from "../../database/providers-db/MongoDB";

const createMongoDBSchema = async () => {
    const db = App.container('db').provider<MongoDB>().getDb();

    if ((await db.listCollections().toArray()).map(c => c.name).includes('migrations')) {
        return;
    }

    await db.createCollection('migrations');
}

export default createMongoDBSchema