import AuthProvider from "../domains/auth/providers/AuthProvider";
import ConsoleProvider from "../domains/console/providers/ConsoleProvider";
import DatabaseProvider from "../domains/database/providers/DatabaseProvider";
import EventProvider from "../domains/events/providers/EventProvider";
import ExpressProvider from "../domains/express/providers/ExpressProvider";
import RoutesProvider from "../domains/express/providers/RoutesProvider";
import MakeProvider from "../domains/make/providers/MakeProvider";
import MigrationProvider from "../domains/migrations/providers/MigrationProvider";
import ValidatorProvider from "../domains/validator/providers/ValidatorProvider";
import { IProvider } from "../interfaces/IProvider";

const CoreProviders: IProvider[] = [
    new EventProvider(),
    new DatabaseProvider(),
    new MigrationProvider(),
    new ExpressProvider(),
    new RoutesProvider(),
    new AuthProvider(),
    new ConsoleProvider(),
    new MakeProvider(),
    new ValidatorProvider(),
]

export default CoreProviders