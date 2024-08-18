import IFactory from "@src/core/interfaces/IFactory";

type ModelConstructor<Model> = new (data: any) => Model

export default abstract class Factory<Model, Data> implements IFactory {
    protected modelCtor: ModelConstructor<Model>;

    constructor(modelCtor: ModelConstructor<Model>) {
        this.modelCtor = modelCtor;
    }

    create = (data: Data): Model => {
        return new this.modelCtor(data)
    }
}