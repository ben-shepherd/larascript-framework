import { ModelConstructor } from "@src/core/interfaces/IModel";

export interface IMigrationConfig
{
    schemaMigrationDir?: string;
    seederMigrationDir?: string;
    keepProcessAlive?: boolean;
    modelCtor?: ModelConstructor;
}