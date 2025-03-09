import BaseProvider from "@src/core/base/Provider";
import { validatorFn } from "@src/core/domains/validator/service/Validator";

class ValidatorProvider extends BaseProvider {

    async register(): Promise<void> {
        this.log('Registering ValidatorProvider');

        // Bind a helper function for on the fly validation
        this.bind('validatorFn', validatorFn);

    }

}

export default ValidatorProvider