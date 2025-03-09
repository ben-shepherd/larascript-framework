/**
 * Environment type constants
 */
export const EnvironmentDevelopment = 'development';
export const EnvironmentProduction = 'production';
export const EnvironmentTesting = 'testing';

/**
 * Environment type
 */
export type EnvironmentType = typeof EnvironmentDevelopment | typeof EnvironmentProduction | typeof EnvironmentTesting;

export type EnvironmentConfig = {
    environment: EnvironmentType
}

/**
 * Environment constants
 */
const Environment = Object.freeze({
    development: EnvironmentDevelopment,
    production: EnvironmentProduction,
    testing: EnvironmentTesting,
});

export default Environment
