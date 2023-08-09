import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.2/command/command.ts";
import { Input } from "https://deno.land/x/cliffy@v1.0.0-rc.2/prompt/mod.ts";
import { airtable } from "../index.ts";
import { interrogateError } from "../utils.ts";

const editBleepCommand = new Command()
  .description("Edit a Bleep")
  .option("-id <id:string>", "Bleep ID to edit")
  .option("-t, --title <title:string>", "Bleep Title")
  .option("-c, --content <content:string>", "Bleep Content")
  .arguments("[id]")
  .action(async ({ id, title, content }, ...args) => {
    id = args[0] ?? id ?? await Input.prompt({ message: "Bleep ID:", minLength: 1 });
    if (!title) {
      title = await Input.prompt({ message: "Bleep Title:", minLength: 1 });
    }
    if (!content) {
      content = await Input.prompt({ message: "Bleep Content:", minLength: 1 });
    }

    const response = await airtable.update<
      { id: string; createdTime: string; fields: { [key: string]: string } }
    >(id, {
      Title: title,
      Content: content,
    });

    interrogateError(response, "Failed to update bleep");

    if (response && response.id) {
      console.log(`Bleep ${response.id} updated`);
    }
  });

export default editBleepCommand;
