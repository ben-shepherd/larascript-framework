import BaseProvider from "@src/core/base/Provider";
import ValidatorService from "@src/core/domains/validator-legacy/services/ValidatorService";
import { App } from "@src/core/services/App";

class ValidationProvider extends BaseProvider {

    async register(): Promise<void> {
        App.setContainer('validate', new ValidatorService());
    }

}

export default ValidationProvider