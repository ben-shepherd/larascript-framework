import Model from "@src/core/base/Model";
import IModelData from "@src/core/interfaces/IModelData";

export interface MigrationModelData extends IModelData {
    name: string;
    batch: number;
    checksum: string;
    appliedAt: Date;
}

class MigrationModel extends Model<MigrationModelData> {

    table = 'migrations'

    public dates = [
        'appliedAt'
    ]

    public fields: string[] = [
        'name',
        'batch',
        'checksum',
        'appliedAt'
    ]

}

export default MigrationModel