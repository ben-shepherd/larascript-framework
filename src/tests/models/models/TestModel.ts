import { IModelAttributes } from "@src/core/interfaces/IModel";
import Model from "@src/core/models/base/Model";

export interface TestModelData extends IModelAttributes {
    name: string
}

class TestModel extends Model<TestModelData> {

    public table: string = 'tests';

    public fields: string[] = [
        'name',
        'createdAt',
        'updatedAt'
    ]

}

export default TestModel