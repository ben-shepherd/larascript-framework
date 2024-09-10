/* eslint-disable no-undef */
import { describe, test } from '@jest/globals';
import makeTestHelper from '@src/tests/make/makeTestHelper';
import fs from 'fs';


const makeTypes = makeTestHelper.getArrayOfCommandTypes();

describe(`testing make commands (total ${makeTypes.length})`, () => {

    const fileName = 'Test';
    const collection = 'TestCollection';
    let currentCount = 0;

    /**
     * Loop over all make types
     * e.g. Command, Repository, Model etc.
     */
    for (const makeType of makeTypes) {
        test(`make ${makeType} (${currentCount}/${makeTypes.length})`, async () => {

            // Determine the command class to use
            const cmdCtor = makeTestHelper.getCommandCtorByType(makeType);
            const cmd = new cmdCtor();

            // Set the parsed arguments (name, and also collection which is used for the model + repository)
            cmd.setParsedArguments(makeTestHelper.getParsedArguments(fileName, collection));

            // Execute the command
            await cmd.execute();

            // Get the command file name, as it will overwrite the name we've specified (By adding a suffix e.g. TestProvider)
            const cmdFileName = cmd.getArguementByKey('name')?.value; 
            expect(cmdFileName).toBeTruthy();

            // Determine the full output path
            const targetFileFullPath = cmd.getMakeFileService().getTargetDirFullPath();
            expect(targetFileFullPath).toBeTruthy();
            expect(fs.existsSync(targetFileFullPath)).toBeTruthy();

            // Update the filesToUnlink array, count for logging purposes
            currentCount++;

            //  Clean up files
            fs.unlinkSync(targetFileFullPath);
            expect(fs.existsSync(targetFileFullPath)).toBeFalsy();
        })
    }
});