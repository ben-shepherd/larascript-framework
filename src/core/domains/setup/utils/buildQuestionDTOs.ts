import CopyEnvExampleAction from "@src/core/domains/setup/actions/CopyEnvExampleAction";
import GenerateJwtSecretAction from "@src/core/domains/setup/actions/GenerateJwtSecretAction";
import SetupDefaultDatabase from "@src/core/domains/setup/actions/SetupDefaultDatabase";
import SetupDockerDatabases from "@src/core/domains/setup/actions/SetupDockerDatabases";
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
            question: 'Which database providers should be installed? (all/mongodb/postgres). This step will overwrite your .env file.',
            previewText: 'Choose Database Provider To Install',
            defaultValue: 'all',
            acceptedAnswers: ['all', 'mongodb', 'postgres', ''],
            actionCtors: [SetupDockerDatabases, SetupDefaultDatabase]
        }),
        new QuestionDTO({
            id: QuestionIDs.selectDefaultDb,
            question: 'Which default database do you want to use?. This step will overwrite your .env file.',
            previewText: 'Select Default Database',
            defaultValue: 'mongodb',
            acceptedAnswers: ['mongodb', 'postgres', ''],
            actionCtor: SetupDefaultDatabase,
            applicableOnly: {
                ifId: QuestionIDs.selectDb,
                answerIncludes: ['all']
            }
        }),
        // todo: Add question for enabling express
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