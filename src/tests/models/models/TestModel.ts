import Model from "@src/core/base/Model";

type TestModelData = {
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