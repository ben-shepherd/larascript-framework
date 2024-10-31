import { ICtor } from "@src/core/interfaces/ICtor";

const compose = (BaseClass: ICtor, ...mixins) => {
    return mixins.reduce((Class, mixinFunc) => mixinFunc(Class), BaseClass);
}

export default compose 