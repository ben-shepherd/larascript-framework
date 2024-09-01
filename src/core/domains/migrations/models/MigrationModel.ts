import Model from "@src/core/base/Model";
import { Dates } from "@src/core/interfaces/IModel";
import IModelData from "@src/core/interfaces/IModelData";

export interface MigrationModelData extends IModelData {
    name: string;
    batch: number;
    checksum: string;
    appliedAt: Date;
}

class MigrationModel extends Model<MigrationModelData>
{
    collection = 'migrations'

    public dates: Dates = [
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