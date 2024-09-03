export interface IMigration {
    /**
     * This should be set only if this migration should run on a specific database provider
     */
    databaseProvider?:  string;
    /**
     * Run the migrations up
     */
    up(): Promise<void>
    /**
     * Run the migrations down
     */
    down(): Promise<void>
    /**
     * Check if the current database provider matches databaseProvider
     */
    shouldUp(): boolean;
}