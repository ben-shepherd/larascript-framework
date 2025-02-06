export interface IValidatorResult<T extends object> {
    validated(): T;
    passes(): boolean;
    fails(): boolean;
    errors(): Record<string, string>;
}



