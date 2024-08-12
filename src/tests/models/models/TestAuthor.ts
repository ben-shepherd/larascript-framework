import Model from "@src/core/base/Model";
import { TestMovieModel } from "@src/tests/models/models/TestMovie";

export type TestAuthorModelData = {
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
            localKey: '_id',
            localModel: this,
            foreignKey: 'authorId',
            foreignModelCtor: TestMovieModel
        })
    }

    public async moviesFromYear(year: number): Promise<TestMovieModel[]> {
        return this.hasMany({
            localKey: '_id',
            localModel: this,
            foreignKey: 'authorId',
            foreignModelCtor: TestMovieModel,
            filters: {
                yearReleased: year.toString()
            }
        })
    }
}