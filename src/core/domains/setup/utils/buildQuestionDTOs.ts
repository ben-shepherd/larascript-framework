import DatabaseAdapter from "@src/core/domains/database/services/DatabaseAdapter";
import CopyEnvExampleAction from "@src/core/domains/setup/actions/CopyEnvExampleAction";
import EnableExpress from "@src/core/domains/setup/actions/EnableExpress";
import GenerateJwtSecretAction from "@src/core/domains/setup/actions/GenerateJwtSecretAction";
import SetupDefaultDatabase from "@src/core/domains/setup/actions/SetupDefaultDatabase";
import SetupDockerDatabaseScripts from "@src/core/domains/setup/actions/SetupDockerDatabaseScripts";
import { QuestionIDs } from "@src/core/domains/setup/consts/QuestionConsts";
import QuestionDTO from "@src/core/domains/setup/DTOs/QuestionDTO";

const ENV_OVERWRITE_WARNING = 'This step will overwrite your .env file.';
const acceptedAnswersBoolean = ['yes', 'no', 'y', 'n', ''];

const acceptedDatabaseAdaptersAnswers = (() => {
    return ['all', '', ...DatabaseAdapter.getComposerShortFileNames()]
});

const buildQuestionDTOs = (): QuestionDTO[] => {
    return [
        new QuestionDTO({
            id: QuestionIDs.copyEnvExample,
            statement: `The .env.example file will be copied to .env if no .env file exists.`,
            previewText: 'Setup Environment File',
            actionCtor: CopyEnvExampleAction
        }),
        new QuestionDTO({
            id: QuestionIDs.jwtSecret,
            question: `Would you like to generate a new JWT secret? ${ENV_OVERWRITE_WARNING}`,
            previewText: 'Generate New JWT Secret',
            defaultValue: 'yes',
            acceptedAnswers: acceptedAnswersBoolean,
            actionCtor: GenerateJwtSecretAction,
        }),
        new QuestionDTO({
            id: QuestionIDs.selectDb,
            question: `Select database docker containers to setup (options: all, mongodb, postgres). ${ENV_OVERWRITE_WARNING}`,
            previewText: 'Select Database Adapters',
            defaultValue: 'all',
            acceptedAnswers: acceptedDatabaseAdaptersAnswers(),
            actionCtors: [SetupDockerDatabaseScripts, SetupDefaultDatabase]
        }),
        new QuestionDTO({
            id: QuestionIDs.selectDefaultDb,
            question: `Please select your primary database system (mongodb/postgres). ${ENV_OVERWRITE_WARNING}`,
            previewText: 'Set Primary Database',
            defaultValue: 'postgres',
            acceptedAnswers: ['mongodb', 'postgres', ''],
            actionCtor: SetupDefaultDatabase,
            applicableOnly: {
                ifId: QuestionIDs.selectDb,
                answerIncludes: ['all']
            }
        }),
        new QuestionDTO({
            id: QuestionIDs.enableExpress,
            question: `Would you like to enable the Express server? (yes/no) ${ENV_OVERWRITE_WARNING}`,
            previewText: 'Enable Express Server',
            defaultValue: 'yes',
            acceptedAnswers: acceptedAnswersBoolean,
            actionCtor: EnableExpress,
        }),
        new QuestionDTO({
            id: QuestionIDs.appPort,
            question: `Which port should the application listen on? ${ENV_OVERWRITE_WARNING}`,
            previewText: 'Set Server Port',
            defaultValue: '5000',
            applicableOnly: {
                ifId: QuestionIDs.enableExpress,
                answerIncludes: ['yes', 'y']
            }
        }),
        new QuestionDTO({
            id: QuestionIDs.enableAuthRoutes,
            question: `Would you like to enable authentication routes? (yes/no) ${ENV_OVERWRITE_WARNING}`,
            previewText: 'Enable Authentication',
            defaultValue: 'yes',
            acceptedAnswers: acceptedAnswersBoolean,
            applicableOnly: {
                ifId: QuestionIDs.enableExpress,
                answerIncludes: ['yes', 'y']
            }
        }),
        new QuestionDTO({
            id: QuestionIDs.enableAuthRoutesAllowCreate,
            question: `Should users be allowed to create new accounts? (yes/no) ${ENV_OVERWRITE_WARNING}`,
            previewText: 'Allow User Registration',
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