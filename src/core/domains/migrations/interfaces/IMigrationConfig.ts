import { ModelConstructor } from "@src/core/interfaces/IModel";

export interface IMigrationConfig
{
    appMigrationsDir?: string;
    keepProcessAlive?: boolean;
    modelCtor?: ModelConstructor;
}