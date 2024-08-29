import QuestionDTO from '@src/core/domains/setup/DTOs/QuestionDTO';
import { IAction } from '@src/core/domains/setup/interfaces/IAction';
import { ISetupCommand } from '@src/core/domains/setup/interfaces/ISetupCommand';
import { IPackageJsonService } from '@src/core/interfaces/IPackageJsonService';
import PackageJsonService from '@src/core/services/PackageJsonService';
import DatabaseDriverConsts from '../../database/consts/DatabaseDriverConsts';
import DatabasePackageConsts from '../../database/consts/DatabasePackageConsts';

class InstallDatabasePackages implements IAction
{
    packageJson: IPackageJsonService;

    constructor() 
    {
        this.packageJson = new PackageJsonService();
    }

    /**
     * Handle the action 
     * - Updates the package.json up script
     * @param ref 
     * @param question 
     */
    async handle(ref: ISetupCommand, question: QuestionDTO): Promise<any>
    {
        await this.handleSingleDatabase(ref, question);
        await this.handleAllDatabases(ref, question);
    }

    /**
     * @param ref 
     * @param question 
     * @returns 
     */
    async handleSingleDatabase(ref: ISetupCommand, question: QuestionDTO)
    {
        const dbType = question.getAnswer() as string;

        if(dbType === 'all') {
            return;
        }

        // Clean up old packages
        Object.keys(DatabaseDriverConsts).forEach(async type => {
            if(type === question.answer) {
                return;
            }

            const packageName = DatabasePackageConsts[type] ?? type;
            await this.packageJson.uninstallPackage(packageName);
        })


        const packageName = DatabasePackageConsts[dbType] ?? dbType;
        ref.writeLine('Installing package ' + packageName);

        await this.packageJson.installPackage(packageName);
        ref.writeLine('Successfully installed package ' + packageName);
    }

    /**
     * @param ref 
     * @param question 
     * @returns 
     */
    async handleAllDatabases(ref: ISetupCommand, question: QuestionDTO)
    {
        const dbType = question.getAnswer() as string;

        if(dbType !== 'all') {
            return;
        }

        ref.writeLine('Installing all packages...' + Object.values(DatabaseDriverConsts).join(', '));

        Object.keys(DatabaseDriverConsts).forEach(async type => {
            const packageName = DatabasePackageConsts[type] ?? type;
            await this.packageJson.installPackage(packageName);
        });

        ref.writeLine('Successfully installed all packages');
    
    }
}

export default InstallDatabasePackages