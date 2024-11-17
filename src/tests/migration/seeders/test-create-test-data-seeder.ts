import BaseSeeder from "@src/core/domains/migrations/base/BaseSeeder";
import TestModel from "@src/tests/models/models/TestModel";

export class Seeder extends BaseSeeder {

    group?: string = 'testing';

    async up(): Promise<void> {
        
        const model = new TestModel({
            name: 'John'
        })
        await model.save();

        const model2 = new TestModel({
            name: 'Jane'
        })
        await model2.save();

    }

}