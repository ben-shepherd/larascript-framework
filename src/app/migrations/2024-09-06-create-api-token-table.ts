import ApiToken from "@src/core/domains/auth/models/ApiToken";
import { authJwt } from "@src/core/domains/auth/services/JwtAuthService";
import BaseMigration from "@src/core/domains/migrations/base/BaseMigration";

export class CreateApiTokenMigration extends BaseMigration {

    group?: string = 'app:setup';

    async up(): Promise<void> {
        await this.schema.createTable(ApiToken.getTable(), authJwt().getCreateApiTokenTableSchema())
    }

    async down(): Promise<void> {
        await this.schema.dropTable(ApiToken.getTable());
    }

}