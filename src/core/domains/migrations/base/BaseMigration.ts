import { App } from "@src/core/services/App";
import { IMigration } from "../interfaces/IMigration";

class BaseMigration implements IMigration
{
    databaseProvider?: string | undefined;

    /**
     * Run the migration
     */
    up(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    /**
     * Rollback the migration
     */
    down(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    /**
     * Check if the migration should run
     * @returns 
     */
    shouldUp(): boolean
    {
        if(!this.databaseProvider) { 
            return true;
        }

        return App.container('db').isProvider(this.databaseProvider);
    }
}

export default BaseMigration;