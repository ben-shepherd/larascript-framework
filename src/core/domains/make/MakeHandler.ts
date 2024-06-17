import path from "path";

export default class MakeHandler {
    public makeModel(command: string)
    {
        const makeFiles = 'src/core/domains/make/files';

        console.log('make files', path.resolve(makeFiles))
    }
}