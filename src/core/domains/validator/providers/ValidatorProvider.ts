import BaseProvider from "@src/core/base/Provider";
import { App } from "@src/core/services/App";
import ValidatorService from "../services/ValidatorService";

class ValidationProvider extends BaseProvider
{
    async register(): Promise<void> 
    {
        App.setContainer('validator', new ValidatorService());
    }

    async boot(): Promise<void> {}
}

export default ValidationProvider