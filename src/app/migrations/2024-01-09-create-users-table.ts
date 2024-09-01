import { IMigration } from "@src/core/domains/migrations/interfaces/IMigration";
import { App } from "@src/core/services/App";
import { MongoClient } from "mongodb";

export class Migration implements IMigration {

    async up(): Promise<void> {
        console.log('[Migration] 2024-01-09-create-users-table UP');

        const client = App.container('db').getClient<MongoClient>();
        await client.db().createCollection('testUsers');
    }

    async down(): Promise<void> {
        console.log('[Migration] 20244-01-09-create-users-table DOWN');

        const client = App.container('db').getClient<MongoClient>();
        await client.db().dropCollection('testUsers');
    }
}