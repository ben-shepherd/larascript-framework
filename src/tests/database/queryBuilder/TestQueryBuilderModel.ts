import Model from "@src/core/base/Model";
import IModelAttributes from "@src/core/interfaces/IModelData";

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