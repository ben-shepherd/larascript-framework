import MongoDbDocumentManager from "@src/core/domains/database/documentManagers/MongoDbDocumentManager";
import PostgresDocumentManager from "@src/core/domains/database/documentManagers/PostgresDocumentManager";
import { IDatabaseProvider } from "@src/core/domains/database/interfaces/IDatabaseProvider";
import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";
import { IDocumentManager } from "@src/core/domains/database/interfaces/IDocumentManager";
import MongoDB from "@src/core/domains/database/providers-db/MongoDB";
import Postgres from "@src/core/domains/database/providers-db/Postgres";
import MongoDBSchema from "@src/core/domains/database/schema/MongoDBSchema";
import PostgresSchema from "@src/core/domains/database/schema/PostgresSchema";
import { MongoClient } from "mongodb";
import { Sequelize } from "sequelize";

export default interface IDatabaseProviderTypes {
    client: unknown;
    provider: IDatabaseProvider;
    documentManager: IDocumentManager;
    schema: IDatabaseSchema;
}

/**
 * Type definitions for MongoDB
 */
export interface MongoDBTypes extends IDatabaseProviderTypes {
    client: MongoClient;
    provider: MongoDB;
    documentManager: MongoDbDocumentManager;
    schema: MongoDBSchema;
}

/**
 * Type definitions for Postgres
 */
export interface PostgresTypes {
    client: Sequelize;
    provider: Postgres;
    documentManager: PostgresDocumentManager;
    schema: PostgresSchema;
}