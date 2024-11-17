
import { IDatabaseGenericConnectionConfig } from '@src/core/domains/database/interfaces/IDatabaseConfig';
import { MongoClientOptions } from 'mongodb';

export interface IMongoConfig extends IDatabaseGenericConnectionConfig<MongoClientOptions> {}