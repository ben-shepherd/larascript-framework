import { IDatabaseConfig } from '@src/core/domains/database/interfaces/IDatabaseConfig';
import DatabaseProvider from '@src/core/domains/database/providers/DatabaseProvider';

import testDatabaseConfig from '../config/testDatabaseConfig';

export default class TestDatabaseProvider extends DatabaseProvider {

    protected config: IDatabaseConfig = testDatabaseConfig;

}