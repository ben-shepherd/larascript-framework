import Model from "@src/core/base/Model";
import { TestAuthorModel } from "@src/tests/models/models/TestAuthor";

export type TestMovieModelData = {
    authorId?: string;
    name?: string;
    yearReleased?: string;
}
export class TestMovieModel extends Model<TestMovieModelData> {
    public collection: string = 'tests';

    public fields: string[] = [
        'authorId',
        'name',
        'yearReleased',
        'createdAt',
        'updatedAt'
    ]

    public async author(): Promise<TestAuthorModel | null> {
        return this.belongsTo({
            localKey: 'authorId',
            localModel: this,
            foreignKey: '_id',
            foreignModelCtor: TestAuthorModel
        })
    }

    public async authorByName(name: string): Promise<TestAuthorModel | null> {
        return this.belongsTo({
            localKey: 'authorId',
            localModel: this,
            foreignKey: '_id',
            foreignModelCtor: TestAuthorModel,
            filters: {
                name
            }
        })
    }
}