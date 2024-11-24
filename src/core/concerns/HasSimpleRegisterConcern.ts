import BaseSimpleRegister from "../base/BaseSimpleRegister";

const HasSimpleRegisterConcern = () => {
    return class extends BaseSimpleRegister {}
}

export default HasSimpleRegisterConcern