export interface IProvider {
    register(): Promise<void>;
    boot(): Promise<void>;
    getProviderName(): string | null;
}