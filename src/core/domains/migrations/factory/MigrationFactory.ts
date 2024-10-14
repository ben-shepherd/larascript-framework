import MigrationModel from "@src/core/domains/migrations/models/MigrationModel";
import { IModel, ModelConstructor } from "@src/core/interfaces/IModel";


type Props = {
    name: string;
    batch: number;
    checksum: string;
    appliedAt: Date;
}

class MigrationFactory {

    /**
     * Create a migration model
     * @param param0 
     * @returns 
     */
    create({ name, batch, checksum, appliedAt }: Props, modelCtor: ModelConstructor = MigrationModel): IModel {
        return new modelCtor({
            name,
            batch,
            checksum,
            appliedAt
        });
    }

}

export default MigrationFactory