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
    protected jsonResponse(data: object, code: number = 200) {
        this.context.getResponse().setHeader('Content-Type', 'application/json')
        this.context.getResponse().status(code).send(data)
    }

    /**
     * Sends a successful JSON response with 200 status code
     * @param data The data to send
     */
    protected ok(data: object) {
        return this.jsonResponse(data, 200);
    }

    /**
     * Sends a created JSON response with 201 status code
     * @param data The data to send
     */
    protected created(data: object) {
        return this.jsonResponse(data, 201);
    }

    /**
     * Sends a no content response with 204 status code
     */
    protected noContent() {
        this.context.getResponse().status(204).send();
    }

    /**
     * Sends a bad request response with 400 status code
     * @param message Error message
     */
    protected badRequest(message: string = 'Bad Request') {
        return this.jsonResponse({ error: message }, 400);
    }

    /**
     * Sends an unauthorized response with 401 status code
     * @param message Error message
     */
    protected unauthorized(message: string = 'Unauthorized') {
        return this.jsonResponse({ error: message }, 401);
    }

    /**
     * Sends a forbidden response with 403 status code
     * @param message Error message
     */
    protected forbidden(message: string = 'Forbidden') {
        return this.jsonResponse({ error: message }, 403);
    }

    /**
     * Sends a not found response with 404 status code
     * @param message Error message
     */
    protected notFound(message: string = 'Not Found') {
        return this.jsonResponse({ error: message }, 404);
    }

    /**
     * Sends an internal server error response with 500 status code
     * @param message Error message
     */
    protected serverError(message: string = 'Internal Server Error') {
        return this.jsonResponse({ error: message }, 500);
    }

    /**
     * Redirects to a specified URL
     * @param url The URL to redirect to
     * @param statusCode The status code to use (default: 302)
     */
    protected redirect(url: string, statusCode: number = 302) {
        this.context.getResponse().redirect(statusCode, url);
    }

}

export default Controller