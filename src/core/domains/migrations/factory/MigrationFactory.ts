import { MigrationType } from "@src/core/domains/migrations/interfaces/IMigration";
import MigrationModel from "@src/core/domains/migrations/models/MigrationModel";
import { IModel, ModelConstructor } from "@src/core/domains/models/interfaces/IModel";


type Props = {
    name: string;
    batch: number;
    checksum: string;
    type: MigrationType;
    appliedAt: Date;
}

class MigrationFactory {

    /**
     * Create a migration model
     * @param param
     * @returns 
     */
    create({ name, batch, checksum, type, appliedAt }: Props, modelCtor: ModelConstructor = MigrationModel): IModel {
        return new modelCtor({
            name,
            batch,
            checksum,
            type,
            appliedAt
        });
    }

}

export default MigrationFactory