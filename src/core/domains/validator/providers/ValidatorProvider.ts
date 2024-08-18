import BaseProvider from "@src/core/base/Provider";
import { App } from "@src/core/services/App";
import ValidatorService from "@src/core/domains/validator/services/ValidatorService";

class ValidationProvider extends BaseProvider
{
    async register(): Promise<void> 
    {
        App.setContainer('validate', new ValidatorService());
    }

    async boot(): Promise<void> {}
}

export default ValidationProvider