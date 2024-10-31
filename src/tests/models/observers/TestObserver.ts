import Observer from "@src/core/domains/observer/services/Observer";
import { TestObserverModelData } from "@src/tests/models/models/TestObserverModel";

class TestObserver extends Observer {

    async creating(data: TestObserverModelData): Promise<TestObserverModelData> {
        data.number = 1;
        return data
    }

    // eslint-disable-next-line no-unused-vars
    onNameChange = (data: TestObserverModelData['name']) => {
        return 'Bob'
    }

}

export default TestObserver