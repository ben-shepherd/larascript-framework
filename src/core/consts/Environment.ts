export const EnvironmentDevelopment = 'development';
export const EnvironmentProduction = 'production';
export const EnvironmentTesting = 'testing';

export type EnvironmentType = typeof EnvironmentDevelopment | typeof EnvironmentProduction | typeof EnvironmentTesting;

const Environment = Object.freeze({
    development: EnvironmentDevelopment,
    production: EnvironmentProduction,
    testing: EnvironmentTesting,
})

export default Environment