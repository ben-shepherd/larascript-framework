const Sequencer = require('@jest/test-sequencer').default;

const firstTest = 'runApp.test.ts';
const secondTest = 'migration.test.ts';
const thirdTest = 'seeder.test.ts';
const lastTest = 'endTests.test.ts';

/**
 * Custom sequencer to make sure runApp runs first
 */
class CustomSequencer extends Sequencer {

    sort(tests) {
        return tests.sort((testA, testB) => {
            if (testA.path.includes(firstTest)) return -1;
            if (testB.path.includes(firstTest)) return 1;
            
            if(testA.path.includes(secondTest)) return -1;
            if(testB.path.includes(secondTest)) return 1;

            if(testA.path.includes(thirdTest)) return -1;
            if(testB.path.includes(thirdTest)) return 1;

            if(testA.path.includes(lastTest)) return 1;
            if(testB.path.includes(lastTest)) return -1;
            return 0;
        });
    }

}

module.exports = CustomSequencer;