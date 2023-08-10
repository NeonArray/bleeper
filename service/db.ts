export class Database {
    readonly #bleepKey = "bleeps";
    readonly #kv: Deno.Kv;

    constructor(kv: Deno.Kv) {
        this.#kv = kv;
    }

    async get(): Promise<unknown> {
        return this.#kv.list({ prefix: [this.#bleepKey] });
    }

    async getOne(key: string): Promise<unknown> {
        return this.#kv.get([this.#bleepKey, key]);
    }

    async set(key: string, value: unknown): Promise<void> {
        await this.#kv.set([this.#bleepKey, key], value);
    }

    async delete(key: string): Promise<void> {
        await this.#kv.delete([this.#bleepKey, key]);
    }

    async update(key: string, value: unknown): Promise<void> {
        await this.delete(key);
        await this.set(key, value);
    }
}
