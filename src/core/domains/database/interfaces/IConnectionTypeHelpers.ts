import MongoDbAdapter from "@src/core/domains/mongodb/adapters/MongoDbAdapter";
import PostgresAdapter from "@src/core/domains/postgres/adapters/PostgresAdapter";

/**
 * Type helper for the connection adapters
 */
export type IConnectionTypeHelpers = {
    ['default']: PostgresAdapter;
    ['postgres']: PostgresAdapter;
    ['mongodb']: MongoDbAdapter;
}