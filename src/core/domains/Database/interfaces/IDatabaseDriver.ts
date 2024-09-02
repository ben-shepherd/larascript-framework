import MongoDB from "@src/core/domains/database/drivers/MongoDB";
import { IDatabaseQuery } from "@src/core/domains/database/interfaces/IDatabaseQuery";
import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";
import MongoDBQuery from "@src/core/domains/database/query/MongoDBQuery";
import MongoDBSchema from "@src/core/domains/database/schema/MongoDBSchema";
import { MongoClient } from "mongodb";

export type IDatabaseDriverCtor = new (config: any) => IDatabaseDriver;

/**
 * Type definitions for MongoDB
 */
export interface MongoDBTypes {
    client: MongoClient;
    driver: MongoDB;
    query: MongoDBQuery;
    schema: MongoDBSchema;
}

/**
 * Type definitions for Postgres
 */
export interface PostgresTypes {
    client: unknown;
    driver: unknown;
    query: unknown;
    schema: unknown;
}

/**
 * Interface for database driver
 */
export interface IDatabaseDriver {
    connect(): Promise<void>;
    getClient(): any;
    query(): IDatabaseQuery;
    schema(): IDatabaseSchema;
}