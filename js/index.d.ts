export default class Config {
    private static config;
    static tryLoadEnvFromFile(filename: string): void;
    static initConfig(): void;
    static get(key: string): string;
    static getAs<T>(key: string): T;
}
