import SecurityRule from "../../base/SecurityRule";
import { SecurityEnum } from "../../enums/SecurityEnum";
import RateLimitedMiddleware from "../middleware/RateLimitedMiddleware";

class RateLimitedRule extends SecurityRule {

    constructor(limit: number, perMinuteAmount: number) {
        super({
            id: SecurityEnum.RATE_LIMITED,
            when: null,
            never: null,
            middleware: RateLimitedMiddleware.toExpressMiddleware(limit, perMinuteAmount)
        });
    }

}

export default RateLimitedRule;