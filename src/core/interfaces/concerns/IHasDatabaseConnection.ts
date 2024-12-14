import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";
import { IDocumentManager } from "@src/core/domains/database/interfaces/IDocumentManager";

 

export interface IHasDatabaseConnection {
    connection: string;
    table: string;

    /**
     * @deprecated
     */
    getDocumentManager(): IDocumentManager;
    getSchema(): IDatabaseSchema;
}