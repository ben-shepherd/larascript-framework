import IModelAttributes from "@src/core/interfaces/IModelData";
import Model from "@src/core/models/base/Model";
import { TestMovieModel } from "@src/tests/models/models/TestMovie";

export interface TestAuthorModelData extends IModelAttributes {
    name: string
}
export class TestAuthorModel extends Model<TestAuthorModelData> {

    public table: string = 'tests';

    public fields: string[] = [
        'born',
        'createdAt',
        'updatedAt'
    ]

    public async movies(): Promise<TestMovieModel[]> {
        return this.hasMany(TestMovieModel, {
            localKey: 'id',
            foreignKey: 'authorId'
        })
    }

    public async moviesFromYear(year: number): Promise<TestMovieModel[]> {
        return this.hasMany(TestMovieModel, {
            localKey: 'id',
            foreignKey: 'authorId',
            filters: {
                yearReleased: year
            }
        })
    }

}