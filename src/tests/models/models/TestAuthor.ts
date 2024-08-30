import Model from "@src/core/base/Model";
import IModelData from "@src/core/interfaces/IModelData";
import { TestMovieModel } from "@src/tests/models/models/TestMovie";

export interface TestAuthorModelData extends IModelData {
    name: string
}
export class TestAuthorModel extends Model<TestAuthorModelData> {
    public collection: string = 'tests';

    public fields: string[] = [
        'born',
        'createdAt',
        'updatedAt'
    ]

    public async movies(): Promise<TestMovieModel[]> {
        return this.hasMany({
            localKey: 'id',
            localModel: this,
            foreignKey: 'authorId',
            foreignModelCtor: TestMovieModel
        })
    }

    public async moviesFromYear(year: number): Promise<TestMovieModel[]> {
        return this.hasMany({
            localKey: 'id',
            localModel: this,
            foreignKey: 'authorId',
            foreignModelCtor: TestMovieModel,
            filters: {
                yearReleased: year.toString()
            }
        })
    }
}