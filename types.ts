export interface BleepsRequest {
    records: {
        fields: Bleep;
    }[];
}

export interface Bleep {
    Title: string;
    Content: string;
    Date?: string;
}

export interface BaseRequest {
    name: string;
    workspaceId?: string;
    tables: {
        name: string;
        description: string;
        fields: {
            description: string;
            name: string;
            type: string;
        }[];
    }[];
}

export type RecordOptions = {
    fields?: string[];
    filterByFormula?: string;
    maxRecords?: number;
    pageSize?: number;
    sort?: { field: string; direction: "asc" | "desc" }[];
    view?: string;
    cellFormat?: string;
    timeZone?: string;
    userLocale?: string;
    returnFieldsByFieldId?: boolean;
    recordMetadata?: string[];
} & Record<string, unknown>;

export type FieldShape<T extends { [key: string]: unknown }> = {
    id: string;
    createdTime: string;
    fields: T;
};

// export type AirtableResponseError = {
//   error: string
// };
//
// export type AirtableResponse = {
//   [key: string]: unknown;
//   records?: FieldShape<{ [key: string]: unknown }>[];
// } | AirtableResponseError;

// export interface CacheEvent extends Event {
//   detail: unknown;
// }
