import Repository from "@src/core/base/Repository";
import MigrationModel from "@src/core/domains/migrations/models/MigrationModel";

class MigrationRepository extends Repository<MigrationModel> {

    constructor() {
        super('migrations', MigrationModel)
    }

}

export default MigrationRepository