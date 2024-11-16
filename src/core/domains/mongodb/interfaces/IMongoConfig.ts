
import { MongoClientOptions } from 'mongodb';

import { IDatabaseGenericConnectionConfig } from '../../database/interfaces/IDatabaseConfig';

export interface IMongoConfig extends IDatabaseGenericConnectionConfig<MongoClientOptions> {}