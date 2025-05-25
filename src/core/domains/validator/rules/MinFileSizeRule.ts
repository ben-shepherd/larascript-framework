
import AbstractRule from "@src/core/domains/validator/abstract/AbstractRule";
import { IRule, IRuleError } from "@src/core/domains/validator/interfaces/IRule";
import fileUpload from "express-fileupload";

type Options = {
    minKB: number;
    minMB: number;
}

class MinFileSizeRule extends AbstractRule<Options> implements IRule {

    protected name: string = 'required'

    protected errorTemplate: string = 'The :attribute field must be at least :mb MB in size.';

    protected misconfiguredTemplate: string = 'The minKB or minMB fields were not provided.'

    constructor({ minKB, minMB }: { minMB?: number, minKB?: number }) {
        super({ minKB, minMB })
    }

    public async test(): Promise<boolean> {
        const files = this.getHttpContext().getFiles(this.getAttribute())      
        const tests = files?.every(file => this.handleSingleFile(file))

        return tests ?? false
    }

    /**
     * Test against a single file
     * @param file 
     * @returns 
     */
    protected handleSingleFile(file: fileUpload.UploadedFile): boolean  {
        const sizeMb = this.getMb() as number
        
        if(typeof sizeMb === 'undefined') {
            this.errorTemplate = this.misconfiguredTemplate
            return false
        }

        if(typeof file === 'undefined') {
            return true
        }

        const currentSize = file.size / 1024 / 1024

        if(sizeMb && currentSize > sizeMb) {
            return true
        }

        return false      
    }
    
    public getError(): IRuleError {
        return {
            [this.getDotNotationPath()]: [
                this.formatErrorMessage({
                    mb: this.getMb() ?? 'undefined'
                })
            ]
        }
    }

    /**
     * Get the maximum MB from the options
     * @returns 
     */
    protected getMb(): number | undefined {
        if(typeof this.options.minKB === 'number') {
            return this.options.minKB / 1024
        }

        return this.options.minMB
    }

}


export default MinFileSizeRule;
