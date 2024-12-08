import IModelAttributes from "@src/core/interfaces/IModelData";
import Model from "@src/core/models/base/Model";

export interface TestQueryBuilderModelData extends IModelAttributes {
    name: string,
    age: number
}

class TestQueryBuilderModel extends Model<TestQueryBuilderModelData> {

    public table: string = 'tests';

    public fields: string[] = [
        'name',
        'age',
        'createdAt',
        'updatedAt'
    ]

}

export default TestQueryBuilderModel