import CopyEnvExampleAction from "../actions/CopyEnvExampleAction";
import GenerateJwtSecretAction from "../actions/GenerateJwtSecretAction";
import { QuestionIDs } from "../consts/QuestionConsts";
import QuestionDTO from "../DTOs/QuestionDTO";

const buildQuestionDTOs = (): QuestionDTO[] => {
    return [
        new QuestionDTO({
            id: QuestionIDs.copyEnvExample,
            statement: 'First step is to copy .env.example to .env',
            actionCtor: CopyEnvExampleAction
        }),
        new QuestionDTO({
            id: QuestionIDs.jwtSecret,
            statement: 'We will generate a new JWT Secret',
            actionCtor: GenerateJwtSecretAction
        }),
        new QuestionDTO({
            id: QuestionIDs.selectDb,
            question: 'Which database do you want to use? (mongodb/postgres)',
            defaultValue: 'mongodb',
            acceptedAnswers: ['mongodb', 'postgres', '']
        }),
        new QuestionDTO({
            id: QuestionIDs.appPort,
            question: 'What port should the app listen on?',
            defaultValue: '5000'
        }),
        new QuestionDTO({
            id: QuestionIDs.enableAuthRoutes,
            question: 'Do you want to enable auth routes? (yes/no)',
            defaultValue: 'yes',
            acceptedAnswers: ['yes', 'no', 'y', 'n', '']
        }),
        new QuestionDTO({
            id: QuestionIDs.enableAuthRoutesAllowCreate,
            question: 'Do you want to allow users to create new accounts? (yes/no)',
            defaultValue: 'yes',
            acceptedAnswers: ['yes', 'no', 'y', 'n', '']
        }),
    ]
}

export default buildQuestionDTOs