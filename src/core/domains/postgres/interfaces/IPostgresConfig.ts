
import { Options as SequelizeOptions } from 'sequelize/types/sequelize';

import { IDatabaseGenericConnectionConfig } from '../../database/interfaces/IDatabaseConfig';

export interface IPostgresConfig extends IDatabaseGenericConnectionConfig<SequelizeOptions> {}