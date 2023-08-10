import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.2/command/mod.ts";
import { load } from "https://deno.land/std@0.197.0/dotenv/mod.ts";
import listBleepsCommand from "./commands/listBleeps.ts";
import addBleepCommand from "./commands/addBleep.ts";
import editBleepCommand from "./commands/editBleep.ts";
import deleteBleepCommand from "./commands/deleteBleep.ts";
import { Airtable } from "./service/airtable.ts";
import scaffoldBaseCommand from "./commands/scaffoldBaseCommand.ts";
import { Database } from "./service/db.ts";
import { CacheProxy } from "./service/cacheProxy.ts";

const env = await load();
let pat = env["AIRTABLE_PAT"];
let baseId = env["AIRTABLE_BASE_ID"];
let tableName = env["AIRTABLE_TABLE_NAME"];

if (!pat) {
    pat = Deno.env.get("AIRTABLE_PAT") || "";
    if (pat === "") {
        throw new Error("AIRTABLE_PAT environment variable not set.");
    }
}

if (!baseId) {
    baseId = Deno.env.get("AIRTABLE_BASE_ID") || "";
    if (baseId === "") {
        throw new Error("AIRTABLE_BASE_ID environment variable not set.");
    }
}

if (!tableName) {
    tableName = Deno.env.get("AIRTABLE_TABLE") || "";
    if (tableName === "") {
        throw new Error("AIRTABLE_TABLE environment variable not set.");
    }
}

/**
 * TODO: \
 * I've implemented part of a caching strategy here, but its unused. The more I thought about it, the more I was
 * wondering if I should even bother. If I do decide to continue with it:
 * - Determine which data to cache and in what structure. Should Bleeps be stored individually or in a set?
 * - I need a cache invalidation strategy.
 */
const kv = await Deno.openKv();
const at = new Airtable({ apiKey: pat, baseId, tableName });
export const airtable = new Proxy<Airtable>(
    at,
    new CacheProxy(new Database(kv)),
);

await new Command()
    .name("Bleeper")
    .description("A personal social media platform")
    .command("list", listBleepsCommand)
    .command("scaffold", scaffoldBaseCommand)
    .command("add", addBleepCommand)
    .command("edit", editBleepCommand)
    .command("delete", deleteBleepCommand)
    .parse(Deno.args);
