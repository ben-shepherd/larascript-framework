export interface IPackageJsonService {
    packageJsonPath: string;

    installPackage(name: string): Promise<void>;
    uninstallPackage(name: string): Promise<void>;

    getJson(): Promise<IPackageJson>;
    writeFileContents(contents: string, filePath?: string): Promise<void>;
    readFileContents(filePath?: string): Promise<string>;
}

export interface IPackageJson {
    scripts: Record<string, string>;
    dependencies: Record<string, string>;
  }