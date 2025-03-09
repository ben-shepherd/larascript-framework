import BaseSimpleRegister from "@src/core/base/BaseSimpleRegister";

const HasSimpleRegisterConcern = () => {
    return class extends BaseSimpleRegister {}
}

export default HasSimpleRegisterConcern