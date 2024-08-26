export interface IEnvService {
    envPath: string;
    envExamplePath: string;

    updateValues(props: Record<string, string>, filePath?: string): Promise<void>;
    fetchAndUpdateContent(filePath: string, props: Record<string, string>): Promise<string>;
    readFileContents(filePath: string): Promise<string>;
    copyFileFromEnvExample(from?: string, to?: string): void;
}