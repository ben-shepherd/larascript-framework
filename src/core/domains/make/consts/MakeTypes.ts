
const APP_PATH = '@src/app';
const TEMPLATE_PATH = '@src/core/domains/make/templates';

export const targetDirectories: Record<string, string> = {
    Repository: `${APP_PATH}/repositories`,
    Model: `${APP_PATH}/models`,
    Listener: `${APP_PATH}/events/listeners`,
    Subscriber: `${APP_PATH}/events/subscribers`,
    Service: `${APP_PATH}/services`,
    Singleton: `${APP_PATH}/services`,
    Command: `${APP_PATH}/commands`,
    Observer: `${APP_PATH}/observers`,
    Provider: `${APP_PATH}/providers`,
    Routes: `${APP_PATH}/routes`,
    Middleware: `${APP_PATH}/middleware`,
    Action: `${APP_PATH}/actions`,
    Validator: `${APP_PATH}/validators`,
} as const;

export const templates: Record<string, string> = {
    Repository: `${TEMPLATE_PATH}/Repository.ts.template`,
    Model: `${TEMPLATE_PATH}/Model.ts.template`,
    Listener: `${TEMPLATE_PATH}/Listener.ts.template`,
    Subscriber: `${TEMPLATE_PATH}/Subscriber.ts.template`,
    Service: `${TEMPLATE_PATH}/Service.ts.template`,
    Singleton: `${TEMPLATE_PATH}/Singleton.ts.template`,
    Command: `${TEMPLATE_PATH}/Command.ts.template`,
    Observer: `${TEMPLATE_PATH}/Observer.ts.template`,
    Provider: `${TEMPLATE_PATH}/Provider.ts.template`,
    Routes: `${TEMPLATE_PATH}/Routes.ts.template`,
    Middleware: `${TEMPLATE_PATH}/Middleware.ts.template`,
    Action: `${TEMPLATE_PATH}/Action.ts.template`,
    Validator: `${TEMPLATE_PATH}/Validator.ts.template`,
} as const;

export default Object.freeze({
    targetDirectories,
    templates
})