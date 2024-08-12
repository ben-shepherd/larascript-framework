import Model from "@src/core/base/Model";
import { MovieModel } from "@src/tests/models/models/Movie";

export type AuthorModelData = {
    name: string
}
export class AuthorModel extends Model<AuthorModelData> {
    public collection: string = 'tests';

    public fields: string[] = [
        'born',
        'createdAt',
        'updatedAt'
    ]

    public async movies(): Promise<MovieModel[]> {
        return this.hasMany({
            localKey: '_id',
            localModel: this,
            foreignKey: 'authorId',
            foreignModelCtor: MovieModel
        })
    }

    public async moviesFromYear(year: number): Promise<MovieModel[]> {
        return this.hasMany({
            localKey: '_id',
            localModel: this,
            foreignKey: 'authorId',
            foreignModelCtor: MovieModel,
            filters: {
                yearReleased: year.toString()
            }
        })
    }
}