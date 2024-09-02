import MongoDB from "@src/core/domains/database/providers-db/MongoDB";
import MongoDBQuery from "@src/core/domains/database/query/MongoDBQuery";
import MongoDBSchema from "@src/core/domains/database/schema/MongoDBSchema";
import { MongoClient } from "mongodb";

/**
 * Type definitions for MongoDB
 */
export interface MongoDBTypes {
    client: MongoClient;
    provider: MongoDB;
    query: MongoDBQuery;
    schema: MongoDBSchema;
}

/**
 * Type definitions for Postgres
 */
export interface PostgresTypes {
    client: unknown;
    provider: unknown;
    query: unknown;
    schema: unknown;
}