export interface IMigrationServiceOptions {
    filterByFileName?: string
    group?: string
    batch?: number
}

export interface IMigrationService {
    up(options: IMigrationServiceOptions): Promise<void>;
    down(options: IMigrationServiceOptions): Promise<void>;
}