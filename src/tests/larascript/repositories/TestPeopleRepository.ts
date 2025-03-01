import Repository from "@src/core/base/Repository";
import TestPeopleModel from "@src/tests/larascript/eloquent/models/TestPeopleModel";
export default class TestPeopleRepository extends Repository<TestPeopleModel> {

    constructor(connectionName?: string) {
        super(TestPeopleModel, connectionName)
    }       

    /**
     * Finds one record with name equal to 'Jane'
     * @returns {Promise<IApiTokenModel | null>}
     */
    findOneJane() {
        return this.findOne({
            name: 'Jane'
        })
    }

}