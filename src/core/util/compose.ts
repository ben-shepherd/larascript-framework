import { TClassConstructor } from "@src/core/interfaces/ClassConstructor.t";

const compose = (BaseClass: TClassConstructor, ...mixins) => {
    return mixins.reduce((Class, mixinFunc) => mixinFunc(Class), BaseClass);
}

export default compose 