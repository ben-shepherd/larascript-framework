import { IModelAttributes } from "@src/core/interfaces/IModel";
import Model from "@src/core/models/base/Model";

interface TestDirtyModelAttributes extends IModelAttributes {
    name: string,
    array: string[],
    object: object
}

class TestDirtyModel extends Model<TestDirtyModelAttributes> {

    public table: string = 'tests';

    public fields: string[] = [
        'name',
        'array',
        'object',
        'createdAt',
        'updatedAt'
    ]

    public json: string[] = ['array', 'object']

}

export default TestDirtyModel