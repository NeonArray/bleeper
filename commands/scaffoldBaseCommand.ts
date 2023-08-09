import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.2/command/command.ts";
import { airtable } from "../index.ts";
import { interrogateError } from "../utils.ts";
import { BaseRequest } from "../types.ts";
import { Input } from "https://deno.land/x/cliffy@v1.0.0-rc.2/prompt/input.ts";

const scaffoldBaseCommand = new Command()
  .description("Scaffold the Bleeper Base")
  .arguments("<workspaceId>")
  .action(async (_, ...args) => {
    let workspaceId = args[0];

    if (!workspaceId) {
      console.log(
        "You must first create a workspace, if you haven't already. https://airtable.com/workspaces",
      );
      workspaceId = await Input.prompt({
        message: "Workspace ID:",
        minLength: 1,
      });
    }

    const data: BaseRequest = {
      "name": "Bleeper",
      "workspaceId": workspaceId,
      "tables": [
        {
          "name": "Bleeps",
          "description": "A personal social media",
          "fields": [
            {
              "name": "Title",
              "type": "singleLineText",
              "description": "Bleep Title",
            },
            {
              "name": "Content",
              "type": "multilineText",
              "description": "Bleep Content",
            },
            {
              "name": "Date",
              "type": "singleLineText",
              "description": "Bleep Date",
            },
          ],
        },
      ],
    };

    const response = await airtable.create(data);

    interrogateError(response, "Failed to create bleeper base in Airtable");

    if (response && "id" in response) {
      console.log(`Bleep ${response.id} created`);
    }
  });

export default scaffoldBaseCommand;
