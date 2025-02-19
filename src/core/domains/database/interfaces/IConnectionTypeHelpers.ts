import MongoDbAdapter from "../../mongodb/adapters/MongoDbAdapter";
import PostgresAdapter from "../../postgres/adapters/PostgresAdapter";

/**
 * Type helper for the connection adapters
 */
export type IConnectionTypeHelpers = {
    ['default']: PostgresAdapter;
    ['postgres']: PostgresAdapter;
    ['mongodb']: MongoDbAdapter;
}