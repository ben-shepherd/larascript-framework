import IModelAttributes from "@src/core/interfaces/IModelData";
import Model from "@src/core/models/base/Model";
import TestObserver from "@src/tests/models/observers/TestObserver";

export interface TestObserverModelData extends IModelAttributes {
    number: number;
    name: string
}

class TestObserverModel extends Model<TestObserverModelData> {

    observeProperties: Record<string, string> = {
        name: 'onNameChange'
    }

    constructor(data: TestObserverModelData | null = null) {
        super(data);
        this.observeWith(TestObserver);
    }

    public table: string = 'tests';

    public fields: string[] = [
        'name',
        'number',
        'createdAt',
        'updatedAt'
    ]

}

export default TestObserverModel