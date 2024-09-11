/* eslint-disable no-unused-vars */
/**
 * IPackageJsonService is an interface for a service that handles operations with package.json
 *
 * @interface IPackageJsonService
 */
export interface IPackageJsonService {

    /**
     * Path to the package.json file
     */
    packageJsonPath: string;

    /**
     * Installs a package using yarn
     *
     * @param name - name of the package to install
     * @returns a promise that resolves when the package is installed
     */
    installPackage(name: string): Promise<void>;

    /**
     * Uninstalls a package using yarn
     *
     * @param name - name of the package to uninstall
     * @returns a promise that resolves when the package is uninstalled
     */
    uninstallPackage(name: string): Promise<void>;

    /**
     * Reads the package.json file and returns its contents as an object
     *
     * @returns a promise that resolves with the package.json contents
     */
    getJson(): Promise<IPackageJson>;

    /**
     * Writes the contents to the package.json file
     *
     * @param contents - contents to write to the file
     * @param filePath - path to the file to write to (defaults to packageJsonPath)
     * @returns a promise that resolves when the file is written
     */
    writeFileContents(contents: string, filePath?: string): Promise<void>;

    /**
     * Reads the contents of the package.json file
     *
     * @param filePath - path to the file to read from (defaults to packageJsonPath)
     * @returns a promise that resolves with the contents of the file
     */
    readFileContents(filePath?: string): Promise<string>;
}

/**
 * IPackageJson is an interface for the package.json object
 *
 * @interface IPackageJson
 */
export interface IPackageJson {

    /**
     * Scripts available in the package
     */
    scripts: Record<string, string>;

    /**
     * Dependencies of the package
     */
    dependencies: Record<string, string>;
}
