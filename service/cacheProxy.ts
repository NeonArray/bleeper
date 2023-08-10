import { Airtable } from "./airtable.ts";
import { Database } from "./db.ts";

export class CacheProxy {
    readonly #db: Database;

    constructor(db: Database) {
        this.#db = db;
    }

    get(airtable: Airtable, prop: string) {
        const value = Reflect.get(airtable, prop);
        if (typeof value === "function") {
            return async (...args: unknown[]) => {
                const result = await value.apply(airtable, args);
                if (result) {
                    // await this.#db.set(prop, result);
                }
                return result;
            };
        }
        return value;
    }
}
