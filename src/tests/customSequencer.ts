const Sequencer = require('@jest/test-sequencer').default;

const firstTest = 'runApp.test.ts';

/**
 * Custom sequencer to make sure runApp runs first
 */
class CustomSequencer extends Sequencer {

    sort(tests) {
        return tests.sort((testA, testB) => {
            if (testA.path.includes(firstTest)) return -1;
            if (testB.path.includes(firstTest)) return 1;
            return 0;
        });
    }

}

module.exports = CustomSequencer;