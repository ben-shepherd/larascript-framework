import MongoDB from "@src/core/domains/database/providers-db/MongoDB";
import MongoDBQuery from "@src/core/domains/database/query/MongoDBQuery";
import MongoDBSchema from "@src/core/domains/database/schema/MongoDBSchema";
import { MongoClient } from "mongodb";
import { Sequelize } from "sequelize";
import Postgres from "../providers-db/Postgres";
import PostgresQuery from "../query/PostgresQuery";
import PostgresSchema from "../schema/PostgresSchema";

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
    client: Sequelize;
    provider: Postgres;
    query: PostgresQuery;
    schema: PostgresSchema;
}