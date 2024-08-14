import CopyEnvExampleAction from "../actions/CopyEnvExampleAction"
import GenerateJwtSecretAction from "../actions/GenerateJwtSecretAction"
import { StatementActionCtor } from "../interfaces/IStatementAction"

/**
 * List of question keys
 * Value: Should match the property in .env
 * Value can also be any arbitary string if it belongs to a statement
 */
export const QuestionConstKeys = [
    'COPY_ENV_EXAMPLE',
    'APP_PORT',
    'ENABLE_AUTH_ROUTES',
    'ENABLE_AUTH_ROUTES_ALLOW_CREATE',
    'JWT_SECRET',
    'MONGODB_DEFAULT_URI'
]

/**
 * List of statements
 */
export const StatementConsts: Record<typeof QuestionConstKeys[number], string> = {
    'COPY_ENV_EXAMPLE': 'Firstly, we will copy .env.example to .env',
    'JWT_SECRET': 'We will generate a new JWT Secret',
}

/**
 * List of actions relating to statements
 */
export const StatementActions: Record<typeof QuestionConstKeys[number], StatementActionCtor> = {
    'JWT_SECRET': GenerateJwtSecretAction,
    'COPY_ENV_EXAMPLE': CopyEnvExampleAction
}

/**
 * List of default values
 */
export const QuestionConstsDefaultValues: Record<typeof QuestionConstKeys[number], string> = {
    APP_PORT: '5000',
    MONGODB_DEFAULT_URI: 'mongodb://root:password@localhost:27017/app?authSource=admin',
    ENABLE_AUTH_ROUTES: 'Yes',
    ENABLE_AUTH_ROUTES_ALLOW_CREATE: 'Yes',
} 

/**
 * List of questions
 */
export const QuestionConsts: Record<typeof QuestionConstKeys[number], string> = {
    APP_PORT: 'What port should the app listen on?',
    MONGODB_DEFAULT_URI: 'What is your MongoDB URI?',
    ENABLE_AUTH_ROUTES: 'Do you want to enable auth routes? (yes/no)',
    ENABLE_AUTH_ROUTES_ALLOW_CREATE: 'Do you want to allow users to create new accounts? (yes/no)'
}