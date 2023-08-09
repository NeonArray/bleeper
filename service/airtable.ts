import { crypto } from "https://deno.land/std@0.197.0/crypto/mod.ts";
import {BaseRequest, Bleep, BleepsRequest, RecordOptions} from "../types.ts";

export class Airtable {
  readonly #pat: string;
  readonly #baseId: string;
  readonly #tableName: string;
  readonly #baseUrl = "https://api.airtable.com/v0/";
  /**
   * Currently unused. Will be used to cache responses at some point. Though it might make more sense to let another
   * service handle that.
   * @private
   */
  readonly #cache?: Cache;

  constructor(
    { apiKey, baseId, tableName, cache }: {
      apiKey: string;
      baseId: string;
      tableName: string;
      cache?: Cache;
    },
  ) {
    this.#pat = apiKey;
    this.#baseId = baseId;
    this.#tableName = tableName;
    this.#cache = cache;
  }

  /**
   * @param options
   */
  async select<T>(options: RecordOptions): Promise<T[]> {
    const params = this.parameterize(options);
    const url =
      `${this.#baseUrl}${this.#baseId}/${this.#tableName}?${params.toString()}`;
    const response = await this.request<{ records: T[] }>({
      method: "GET",
      url,
    });

    if (!response) {
      return [];
    }

    return response.records;
  }

  /**
   * @param entity
   */
  async create(
    entity: BleepsRequest | BaseRequest,
  ): Promise<void | { records: { [p: string]: unknown }[] }> {
    let url = `${this.#baseUrl}${this.#baseId}/${this.#tableName}`;

    if ("tables" in entity) {
      url = `${this.#baseUrl}meta/bases`;
    }

    return await this.request({
      method: "POST",
      url,
      body: JSON.stringify(entity),
    });
  }

  /**
   * @param id
   * @param bleep
   */
  async update<T>(id: string, bleep: Bleep): Promise<void | T> {
    const url = `${this.#baseUrl}${this.#baseId}/${this.#tableName}/${id}`;
    const data = {
      "fields": {
        "Title": bleep.Title,
        "Content": bleep.Content,
      },
    };
    return await this.request<T>({
      method: "PATCH",
      url,
      body: JSON.stringify(data),
    });
  }

  /**
   * @param id
   */
  async delete<T>(id: string): Promise<void | T> {
    const url = `${this.#baseUrl}${this.#baseId}/${this.#tableName}/${id}`;
    return await this.request<T>({ method: "DELETE", url });
  }

  /**
   * Convert values into an array of key-value pairs
   * @param options
   * @private
   */
  private parameterize(options: RecordOptions): URLSearchParams {
    const values = Object.entries(options).map(([key, value]) => {
      return [key, JSON.stringify(value)] as [string, string];
    });
    return new URLSearchParams(values);
  }

  /**
   * @param method
   * @param url
   * @param body
   * @private
   */
  private async request<T>(
      {method, url, body = ""}: { method: string; url: string; body?: string },
  ): Promise<T | void> {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 60_000);

    const headers = new Headers();
    headers.set("Authorization", `Bearer ${this.#pat}`);

    if (method.toUpperCase() === "POST" || method.toUpperCase() === "PATCH") {
      headers.set("Content-Type", "application/json");
    }

    try {
      const response = await fetch(url, {method, headers, body: body !== "" ? body : undefined});
      clearTimeout(timeout);
      if (response.status === 429) {
        setTimeout(async () => {
          await this.request({method, url, body});
        }, this.exponentialBackoffJitter(3));
      } else {
        return await response.json() as T;
      }
    } catch (error) {
      clearTimeout(timeout);
      console.error(error);
      Deno.exit(1);
    }
  }

  /**
   * TODO: Currently unused, but likely will be used for caching purposes later.
   * @param obj
   * @private
   */
  private async generateHash(obj: unknown): Promise<string> {
    return crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(JSON.stringify(obj)),
    ).toString();
  }

  private exponentialBackoffJitter(retryLimit: number): number {
    return Math.random() * Math.min(60_000, 5_000 * 2 ** retryLimit);
  }
}
