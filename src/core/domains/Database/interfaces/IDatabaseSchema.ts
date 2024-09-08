export interface IDatabaseSchema {
    createTable(name: string, ...args: any[]): void;
    dropTable(name: string, ...args: any[]): void;  
    tableExists(name: string): Promise<boolean>;
}