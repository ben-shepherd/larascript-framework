
import { IDatabaseGenericConnectionConfig } from '@src/core/domains/database/interfaces/IDatabaseConfig';
import { Options as SequelizeOptions } from 'sequelize/types/sequelize';

export interface IPostgresConfig extends IDatabaseGenericConnectionConfig<SequelizeOptions> {}