export default class Config {
    private static config;
    static tryLoadEnvFromFile(filename: string): boolean;
    static tryLoadEnvAtRootOrParent(filename: string): void;
    static initConfig(): void;
    static get(key: string): string;
    static getAs<T>(key: string): T;
}
