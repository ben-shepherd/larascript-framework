import MigrationModel from "@src/core/domains/migrations/models/MigrationModel";

type Props = {
    name: string;
    batch: number;
    checksum: string;
    appliedAt: Date;
}

class MigrationFactory
{
    /**
     * Create a migration model
     * @param param0 
     * @returns 
     */
    create({ name, batch, checksum, appliedAt }: Props): MigrationModel
    {
        return new MigrationModel({
            name,
            batch,
            checksum,
            appliedAt
        })
    }
}

export default MigrationFactory