import BaseCustomValidator from "@src/core/domains/validator/base/BaseCustomValidator";
import { IRulesObject } from "@src/core/domains/validator/interfaces/IRule";
import FileExtensionRule from "@src/core/domains/validator/rules/FileExtensionRule";
import FileMimeType from "@src/core/domains/validator/rules/FileMimeTypeRule";
import MaxFileSizeRule from "@src/core/domains/validator/rules/MaxFileSizeRule";
import SingleFileRule from "@src/core/domains/validator/rules/SingleFileRule";

class UpdateAvatarValidator extends BaseCustomValidator {

    protected rules: IRulesObject = {
        file: [
            new SingleFileRule(),
            new FileMimeType({ startsWith: 'image' }),
            new FileExtensionRule({ ext: ['jpg', 'jpeg', 'png']}),
            new MaxFileSizeRule({ maxMB: 1 })
        ],
    }
    
}

export default UpdateAvatarValidator