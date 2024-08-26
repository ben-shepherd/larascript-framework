export interface IPackageJsonService {
    packageJsonPath: string;

    getJson(): Promise<IPackageJson>;
    writeFileContents(contents: string, filePath?: string): Promise<void>;
    readFileContents(filePath?: string): Promise<string>;
}

export interface IPackageJson {
    scripts: Record<string, string>;
  }