import { IDatabaseProvider } from "@src/core/domains/database/interfaces/IDatabaseProvider";
import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";

abstract class DatabaseSchema<Provider extends IDatabaseProvider = IDatabaseProvider> implements IDatabaseSchema
{
    protected driver!: Provider;

    constructor(driver: Provider)
    {
        this.driver = driver;
    }
    createTable(name: string, ...args: any[]): void {
        throw new Error("Method not implemented.");
    }

    dropTable(name: string, ...args: any[]): void {
        throw new Error("Method not implemented.");
    }

    tableExists(name: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    alterTable(name: string, ...args: any[]): void {
        throw new Error("Method not implemented.");
    }
}

export default DatabaseSchema