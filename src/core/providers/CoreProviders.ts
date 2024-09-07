import AuthProvider from "@src/core/domains/auth/providers/AuthProvider";
import ConsoleProvider from "@src/core/domains/console/providers/ConsoleProvider";
import DatabaseProvider from "@src/core/domains/database/providers/DatabaseProvider";
import EventProvider from "@src/core/domains/events/providers/EventProvider";
import ExpressProvider from "@src/core/domains/express/providers/ExpressProvider";
import RoutesProvider from "@src/core/domains/express/providers/RoutesProvider";
import MakeProvider from "@src/core/domains/make/providers/MakeProvider";
import MigrationProvider from "@src/core/domains/migrations/providers/MigrationProvider";
import ValidatorProvider from "@src/core/domains/validator/providers/ValidatorProvider";
import { IProvider } from "@src/core/interfaces/IProvider";

const CoreProviders: IProvider[] = [
    new ConsoleProvider(),
    new EventProvider(),
    new DatabaseProvider(),
    new ExpressProvider(),
    new RoutesProvider(),
    new AuthProvider(),
    new MigrationProvider(),
    new MakeProvider(),
    new ValidatorProvider(),
]

export default CoreProviders