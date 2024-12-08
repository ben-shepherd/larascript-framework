import IModelAttributes from "@src/core/interfaces/IModelData";
import Model from "@src/core/models/base/Model";
import { TestAuthorModel } from "@src/tests/models/models/TestAuthor";

export interface TestMovieModelData extends IModelAttributes {
    authorId?: string;
    name?: string;
    yearReleased?: number;
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
        return this.belongsToLegacy(TestAuthorModel, {
            localKey: 'authorId',
            foreignKey: 'id'
        })
    }

    public async authorByName(name: string): Promise<TestAuthorModel | null> {
        return this.belongsToLegacy(TestAuthorModel, {
            localKey: 'authorId',
            foreignKey: 'id',
            filters: {
                name
            }
        })
    }

}