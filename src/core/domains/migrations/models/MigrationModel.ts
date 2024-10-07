import Model from "@src/core/base/Model";
import IModelData from "@src/core/interfaces/IModelData";

/**
 * Represents a migration stored in the database.
 */
export interface MigrationModelData extends IModelData {

    /**
     * The name of the migration.
     */
    name: string;

    /**
     * The batch number of the migration.
     */
    batch: number;

    /**
     * The checksum of the migration.
     */
    checksum: string;

    /**
     * The time when the migration was applied.
     */
    appliedAt: Date;
}

/**
 * Model for migrations stored in the database.
 */
class MigrationModel extends Model<MigrationModelData> {

    constructor(data: MigrationModelData | null, tableName = 'migrations') {
        super(data);
        this.table = tableName
    }

    /**
     * The fields that are dates.
     */
    public dates = [
        'appliedAt'
    ]

    /**
     * The fields of the model.
     */
    public fields: string[] = [
        'name',
        'batch',
        'checksum',
        'appliedAt'
    ]

}

/**
 * The default migration model.
 */
export default MigrationModel
