export interface IMakeOptions {
    signature: string;
    description: string;
    makeType: string;
    args: string[];
    defaultArgs?: string[];
    endsWith?: string;
    startWithLowercase?: boolean;
}