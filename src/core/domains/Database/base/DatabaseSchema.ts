import { IDatabaseDriver } from "@src/core/domains/database/interfaces/IDatabaseDriver";
import { IDatabaseSchema } from "../interfaces/IDatabaseSchema";

abstract class DatabaseSchema implements IDatabaseSchema
{
    protected driver!: IDatabaseDriver;

    constructor(driver: IDatabaseDriver)
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