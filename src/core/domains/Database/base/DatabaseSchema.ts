import { IDatabaseProvider } from "@src/core/domains/database/interfaces/IDatabaseProvider";
import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";

abstract class DatabaseSchema implements IDatabaseSchema
{
    protected driver!: IDatabaseProvider;

    constructor(driver: IDatabaseProvider)
    {
        this.driver = driver;
    }
    createTable(name: string, ...args: any[]): void {
        throw new Error("Method not implemented.");
    }

    dropTable(name: string, ...args: any[]): void {
        throw new Error("Method not implemented.");
    }
}

export default DatabaseSchema