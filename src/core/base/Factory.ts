import IFactory from "../interfaces/IFactory";

type ModelConstructor<M> = new (data: any) => M

export default abstract class Factory<Model, Data> implements IFactory {
    protected modelCtor: ModelConstructor<Model>;

    constructor(modelCtor: ModelConstructor<Model>) {
        this.modelCtor = modelCtor;
    }

    create = (data: Data) => {
        return new this.modelCtor(data)
    }
}