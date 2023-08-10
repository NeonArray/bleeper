# Bleeper

A personal "social media" platform for micro-blogging.

The idea behind this is that you can write posts throughout the day, that are
only visible to yourself by default. This was designed so that I could jot down
things I find interesting or learn, without all the garbage of social media.

Currently it is tightly coupled with Airbase as it's data storage source, but I
suppose I could abstract that out to allow for different storage strategies.

## Usage

1. Create an Airtable PAT (API) key with following:
   Scopes:
   - `data.records:read`
   - `data.records:write`
   - `schema.bases:read`
   - `schema.bases:write`
   Access:
   - `All Workspaces`
2. Create a workspace in Airtable

Download the compiled binary to somwehere of your choice. Give it permissions to
execute such as `chmod +x bleeper`, and run it.

Alternatively you can run it directly from the source. Clone the repo and use
the deno cli to execute the program.

```bash
deno run --allow-net --allow-read --allow-env --unstable index.ts [command]

# or 

deno task exec [command]
```

| Command    | Arguments              | Options                                       | Description                                                                                   |
|------------|------------------------|-----------------------------------------------|-----------------------------------------------------------------------------------------------|
| `scaffold` | `<workspaceId:string>` |                                               | Creates the initial database tables in Airtable (you will need to create the workspace first. |
| `add`      |                        | `-t <string>`, `-c <string>`                  | Post a new Bleep with given title and content                                                 |
| `list`     |                        | `-p,--pageSize <number>`, `-n, -num <number>` | List Bleeps with given page size and number per page                                          |
| `delete`   | `<bleepId:string>`     |                                               | Delete a Bleep with given ID                                                                  |
| `edit`     | `<bleepId:string>`     | `-id <string>`, `-t <string>`, `-c <string>`  | Edit a Bleep with given ID                                                                    |
