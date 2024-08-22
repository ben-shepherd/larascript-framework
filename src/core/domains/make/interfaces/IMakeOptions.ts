export interface IMakeOptions {
    signature: string;
    description: string;
    makeType: string;
    args: string[];
    argsOptional?: string[];
    defaultArgs?: string[];
    endsWith?: string;
    startWithLowercase?: boolean;
}