import BaseConfig from "@src/core/base/BaseConfig";
import { ICtor } from "@src/core/interfaces/ICtor";
import pg from 'pg';

import ParsePostgresConnectionUrl from "../../database/helper/ParsePostgresConnectionUrl";
import { IDatabaseAdapter } from "../../database/interfaces/IDatabaseAdapter";
import { IDatabaseSchema } from "../../database/interfaces/IDatabaseSchema";
import { IDocumentManager } from "../../database/interfaces/IDocumentManager";
import { IPostgresConfig } from "../interfaces/IPostgresConfig";

class PostgresAdapter extends BaseConfig implements IDatabaseAdapter  {

    /**
     * todo: Remove SequelizeOptions
     */
    protected config!: IPostgresConfig;

    constructor(config: IPostgresConfig) {
        super()
        this.setConfig(config);   
    }

    declare getConfig: <T = IPostgresConfig>() => T;

    // eslint-disable-next-line no-unused-vars
    declare setConfig: (config: IPostgresConfig) => void;

    async connectToDatabase(database: string): Promise<pg.Client> {
        const { username: user, password, host, port} = ParsePostgresConnectionUrl.parse(this.config.uri);

        return new pg.Client({
            user,
            password,
            host,
            port,
            database
        });
    }
 
    getDocumentManager(): IDocumentManager {
        throw new Error("Method not implemented.");
    }

    getSchema(): IDatabaseSchema {
        throw new Error("Method not implemented.");
    }

    getClient(): unknown {
        throw new Error("Method not implemented.");
    }

    getQueryBuilderCtor(): ICtor<unknown> {
        throw new Error("Method not implemented.");
    }   

}

export default PostgresAdapter