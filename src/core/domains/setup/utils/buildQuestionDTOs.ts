import DatabaseConfig from "@src/core/domains/database/config/DatabaseConfig";
import CopyEnvExampleAction from "@src/core/domains/setup/actions/CopyEnvExampleAction";
import EnableExpress from "@src/core/domains/setup/actions/EnableExpress";
import GenerateJwtSecretAction from "@src/core/domains/setup/actions/GenerateJwtSecretAction";
import SetupDefaultDatabase from "@src/core/domains/setup/actions/SetupDefaultDatabase";
import SetupDockerDatabases from "@src/core/domains/setup/actions/SetupDockerDatabases";
import { QuestionIDs } from "@src/core/domains/setup/consts/QuestionConsts";
import QuestionDTO from "@src/core/domains/setup/DTOs/QuestionDTO";

const acceptedAnswersBoolean = ['yes', 'no', 'y', 'n', ''];
const acceptedAnswersDatabases = ['all',  '', ...Object.keys(DatabaseConfig.providers)];

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
            question: 'Re-generate the JWT Secret. This step will overwrite your .env file.',
            previewText: 'Generate JWT Secret',
            defaultValue: 'yes',
            acceptedAnswers: acceptedAnswersBoolean,
            actionCtor: GenerateJwtSecretAction,
        }),
        new QuestionDTO({
            id: QuestionIDs.selectDb,
            question: 'Which database providers should be installed? (all/mongodb/postgres). This step will overwrite your .env file.',
            previewText: 'Choose Database Provider To Install',
            defaultValue: 'all',
            acceptedAnswers: acceptedAnswersDatabases,
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
        new QuestionDTO({
           id: QuestionIDs.enableExpress,
           question: 'Do you want to enable express? (yes/no) This step will overwrite your .env file.',
           previewText: 'Enable Express',
           defaultValue: 'yes',
           acceptedAnswers: acceptedAnswersBoolean,
           actionCtor: EnableExpress,
        }),
        new QuestionDTO({
            id: QuestionIDs.appPort,
            question: 'What port should the app listen on? This step will overwrite your .env file.',
            previewText: 'App Listen Port',
            defaultValue: '5000',
            applicableOnly: {
                ifId: QuestionIDs.enableExpress,
                answerIncludes: ['yes', 'y']
            }
        }),
        new QuestionDTO({
            id: QuestionIDs.enableAuthRoutes,
            question: 'Do you want to enable auth routes? (yes/no) This step will overwrite your .env file.',
            previewText: 'Enable Auth Routes',
            defaultValue: 'yes',
            acceptedAnswers: acceptedAnswersBoolean,
            applicableOnly: {
                ifId: QuestionIDs.enableExpress,
                answerIncludes: ['yes', 'y']
            }
        }),
        new QuestionDTO({
            id: QuestionIDs.enableAuthRoutesAllowCreate,
            question: 'Do you want to allow users to create new accounts? (yes/no) This step will overwrite your .env file.',
            previewText: 'Enable Auth Routes Allow Create',
            defaultValue: 'yes',
            acceptedAnswers: acceptedAnswersBoolean,
            applicableOnly: {
                ifId: QuestionIDs.enableExpress,
                answerIncludes: ['yes', 'y']
            }
        }),
    ]
}

export default buildQuestionDTOs