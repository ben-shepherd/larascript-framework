import BaseSeeder from "@src/core/domains/migrations/base/BaseSeeder";

import { SeederTestModel } from "../seeder.test";

export class Seeder extends BaseSeeder {

    group?: string = 'testing';

    async up(): Promise<void> {
        
        const john = SeederTestModel.create({ name: 'John' })
        await john.save();

        const jane = SeederTestModel.create({ name: 'Jane' })
        await jane.save();

    }

}