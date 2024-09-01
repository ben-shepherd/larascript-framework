import Model from "@src/core/base/Model";
import IModelData from "@src/core/interfaces/IModelData";
import { TestAuthorModel } from "@src/tests/models/models/TestAuthor";

export interface TestMovieModelData extends IModelData {
    authorId?: string;
    name?: string;
    yearReleased?: string;
}
export class TestMovieModel extends Model<TestMovieModelData> {
    public table: string = 'tests';

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
            foreignKey: 'id',
            foreignModelCtor: TestAuthorModel
        })
    }

    public async authorByName(name: string): Promise<TestAuthorModel | null> {
        return this.belongsTo({
            localKey: 'authorId',
            localModel: this,
            foreignKey: 'id',
            foreignModelCtor: TestAuthorModel,
            filters: {
                name
            }
        })
    }
}