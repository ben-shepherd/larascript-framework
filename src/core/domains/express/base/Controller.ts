import HttpContext from "../data/HttpContext";
import { IController } from "../interfaces/IController";

class Controller implements IController {

    /** 
     * The context of the controller.
     */
    protected context!: HttpContext;

    constructor(context: HttpContext) {
        this.context = context
    }

    /**
     * Sets the context of the controller.
     * @param context The context to set.
     */
    public setContext(context: HttpContext) {   
        this.context = context
    }

    /**
     * Sends a JSON response.
     * @param message The message to send.
     */
    protected jsonResponse(data: object) {
        this.context.getResponse().setHeader('Content-Type', 'application/json')
        this.context.getResponse().send(data)
    }

}

export default Controller