import { IAction } from '@src/core/domains/setup/interfaces/IAction';
import { ISetupCommand } from '@src/core/domains/setup/interfaces/ISetupCommand';

class CopyEnvExampleAction implements IAction {

    async handle(ref: ISetupCommand): Promise<any> {
        
        

        ref.writeLine('Successfully ran migrations');
    }

}

export default CopyEnvExampleAction