
/**
 * List of question IDs
 * Value: Should match the property in .env
 * Value can also be any arbitary string if it belongs to a statement
 */
export const QuestionIDs = {
    selectDb: 'SELECT_DB',
    copyEnvExample: 'COPY_ENV_EXAMPLE',
    appPort: 'APP_PORT',
    enableAuthRoutes: 'ENABLE_AUTH_ROUTES',
    enableAuthRoutesAllowCreate: 'ENABLE_AUTH_ROUTES_ALLOW_CREATE',
    jwtSecret: 'JWT_SECRET',
    mongodbDefaultUri: 'MONGODB_DEFAULT_URI'
} as const;