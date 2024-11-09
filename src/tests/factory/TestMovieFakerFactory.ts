import Factory from "@src/core/base/Factory";
import { TestMovieModel } from "@src/tests/models/models/TestMovie";

class TestMovieFactory extends Factory<TestMovieModel> {

    constructor() {
        super(TestMovieModel)
    }

    createFakeMovie(): TestMovieModel {
        return this.createWithData({
            authorId: this.faker.number.int({ min: 1, max: 100 }).toString(),
            name: this.faker.person.fullName(),
            yearReleased: this.faker.number.int({ min: 1900, max: 2000 }),
            createdAt: this.faker.date.past(),
            updatedAt: this.faker.date.recent()
        })
    }

}

export default TestMovieFactory