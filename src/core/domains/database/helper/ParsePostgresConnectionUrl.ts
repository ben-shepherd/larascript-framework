class ParsePostgresConnectionUrl {

    // eslint-disable-next-line no-useless-escape
    static readonly pattern = new RegExp(/postgres:\/\/([^:]+):([^@]+)@([^:]+):([^\/]+)\/(.+)/);

    public host!: string;

    public port!: number;

    public username!: string;

    public password!: string;

    public database!: string;

    constructor(options: { host: string; port: number; username: string; password: string; database: string; }) {
        this.host = options.host;
        this.port = options.port;
        this.username = options.username;
        this.password = options.password;
        this.database = options.database;
    }

    /**
     * Parses a Postgres connection URL and returns a new instance of ParsePostgresConnectionUrl
     * @param connectionUrl The connection URL to parse
     * @returns A new instance of ParsePostgresConnectionUrl
     * @throws Error if the connection URL is invalid
     */
    static parsePostgresConnectionUrl(connectionUrl: string) {
        const matches = this.pattern.exec(connectionUrl);

        if (!matches) {
            throw new Error('Invalid Postgres Connection URL');
        }

        return new ParsePostgresConnectionUrl({
            username: matches[1],
            password: matches[2],
            host: matches[3],
            port: parseInt(matches[4]),
            database: matches[5],
        });
    }

}


export default ParsePostgresConnectionUrl