import Model from "@src/core/domains/models/base/Model";
import { IModelAttributes } from "@src/core/interfaces/IModel";
import TestMovieFactory from "@src/tests/factory/TestMovieFakerFactory";

export interface TestMovieModelData extends IModelAttributes {
    authorId?: string;
    name?: string;
    yearReleased?: number;
}
export class TestMovieModel extends Model<TestMovieModelData> {
    
    protected factory = TestMovieFactory;

    public table: string = 'tests';

    public fields: string[] = [
        'authorId',
        'name',
        'yearReleased',
        'createdAt',
        'updatedAt'
    ]

}