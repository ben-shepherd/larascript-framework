import Model from "@src/core/domains/models/base/Model";
import { IModelAttributes } from "@src/core/domains/models/interfaces/IModel";

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