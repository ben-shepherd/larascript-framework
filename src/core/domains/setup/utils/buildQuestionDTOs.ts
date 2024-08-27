import CopyEnvExampleAction from "@src/core/domains/setup/actions/CopyEnvExampleAction";
import GenerateJwtSecretAction from "@src/core/domains/setup/actions/GenerateJwtSecretAction";
import SetupDatabaseAction from "@src/core/domains/setup/actions/SetupDatabaseAction";
import { QuestionIDs } from "@src/core/domains/setup/consts/QuestionConsts";
import QuestionDTO from "@src/core/domains/setup/DTOs/QuestionDTO";

const buildQuestionDTOs = (): QuestionDTO[] => {
    return [
        new QuestionDTO({
            id: QuestionIDs.copyEnvExample,
            statement: 'We will copy the .env.example to .env if it does not exist.',
            previewText: 'Copy .env.example to .env',
            actionCtor: CopyEnvExampleAction
        }),
        new QuestionDTO({
            id: QuestionIDs.jwtSecret,
            statement: 'We will generate a new JWT Secret. This step will overwrite your .env file.',
            previewText: 'Generate JWT Secret',
            actionCtor: GenerateJwtSecretAction
        }),
        new QuestionDTO({
            id: QuestionIDs.selectDb,
            question: 'Which database do you want to use? (mongodb/postgres). This step will overwrite your .env file.',
            previewText: 'Choose Database Provider',
            defaultValue: 'mongodb',
            acceptedAnswers: ['mongodb', 'postgres', ''],
            actionCtor: SetupDatabaseAction
        }),
        new QuestionDTO({
            id: QuestionIDs.appPort,
            question: 'What port should the app listen on? This step will overwrite your .env file.',
            previewText: 'App Listen Port',
            defaultValue: '5000'
        }),
        new QuestionDTO({
            id: QuestionIDs.enableAuthRoutes,
            question: 'Do you want to enable auth routes? (yes/no) This step will overwrite your .env file.',
            previewText: 'Enable Auth Routes',
            defaultValue: 'yes',
            acceptedAnswers: ['yes', 'no', 'y', 'n', '']
        }),
        new QuestionDTO({
            id: QuestionIDs.enableAuthRoutesAllowCreate,
            question: 'Do you want to allow users to create new accounts? (yes/no) This step will overwrite your .env file.',
            previewText: 'Enable Auth Routes Allow Create',
            defaultValue: 'yes',
            acceptedAnswers: ['yes', 'no', 'y', 'n', '']
        }),
    ]
}

export default buildQuestionDTOs