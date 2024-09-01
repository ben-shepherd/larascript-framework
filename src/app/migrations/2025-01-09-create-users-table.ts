import { IMigration } from "@src/core/domains/migrations/interfaces/IMigration";

export class Migration implements IMigration {

    async up(): Promise<void> {
        console.log('[Migration] 2025-01-09-create-users-table UP');
    }

    async down(): Promise<void> {
        console.log('[Migration] 2025-01-09-create-users-table DOWN');
    }
}