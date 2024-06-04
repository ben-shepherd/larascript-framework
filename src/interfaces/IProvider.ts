export interface IProvider {
    register(): Promise<void>;
    boot(): Promise<void>;
}