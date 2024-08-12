import Model from "@src/core/base/Model";
import { AuthorModel } from "@src/tests/models/Author";

export type MovieModelData = {
    authorId: string;
    name: string;
    yearReleased?: string;
}
export class MovieModel extends Model<MovieModelData> {
    public collection: string = 'tests';

    public fields: string[] = [
        'authorId',
        'name',
        'yearReleased',
        'createdAt',
        'updatedAt'
    ]

    public async author(): Promise<AuthorModel | null> {
        return this.belongsTo({
            localKey: 'authorId',
            localModel: this,
            foreignKey: '_id',
            foreignModelCtor: AuthorModel
        })
    }

    public async authorByName(name: string): Promise<AuthorModel | null> {
        return this.belongsTo({
            localKey: 'authorId',
            localModel: this,
            foreignKey: '_id',
            foreignModelCtor: AuthorModel,
            filters: {
                name
            }
        })
    }
}