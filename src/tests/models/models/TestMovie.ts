import IModelAttributes from "@src/core/interfaces/IModelData";
import Model from "@src/core/models/base/Model";

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

}