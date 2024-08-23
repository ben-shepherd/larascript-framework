import { IMakeFileArguments } from "@src/core/domains/make/interfaces/IMakeFileArguments";
import { IMakeOptions } from "@src/core/domains/make/interfaces/IMakeOptions";
import Observer from "@src/core/domains/observer/services/Observer";
import Str from "@src/core/util/str/Str";

class ArgumentObserver<T extends IMakeFileArguments = IMakeFileArguments> extends Observer<IMakeFileArguments>
{
    /**
     * Sets the argument name, depending on the options.startWithLowercase
     * @param data 
     * @param options 
     * @returns 
     */
    setName(data: T, options: IMakeOptions): T
    {
        if(!data.name) {
            throw new Error('Argument name cannot be empty')
        }

        if(options.startWithLowercase) {
            data.name = Str.startWithLowercase(data.name)
        }
        else {
            data.name = Str.startWithUppercase(data.name)
        }

        return data
    }

    /**
     * 
     * @param data 
     * @param options 
     * @returns 
     */
    setEndsWith(data: T, options: IMakeOptions): T
    {
        if(!data.name ) {
            throw new Error('Argument name cannot be empty')
        }
        if(typeof options.endsWith !== 'string') {
            return data
        }

        if(!data.name.endsWith(options.endsWith)) { 
            data.name = `${data.name}${options.endsWith}`
        }

        return data
    }

    /**
     * Sets the default collection name
     * @param data 
     * @param options 
     * @returns 
     */
    setDefaultCollection = (data: T): T => {

        if(!data.name) {
            throw new Error('Argument name cannot be empty')
        }

        if(!data.collection) {
            data.collection = Str.camelCase(Str.plural(data.name))
        }

        return data
    }
}

export default ArgumentObserver