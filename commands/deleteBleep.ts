import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.2/command/command.ts";
import { airtable } from "../index.ts";
import { interrogateError } from "../utils.ts";

const deleteBleepCommand = new Command()
    .description("Delete a Bleep")
    .arguments("<id>")
    .action(async (_, ...args) => {
        const response = await airtable.delete<
            { deleted: boolean; id: string }
        >(
            args[0],
        );

        interrogateError(response, "Failed to delete bleep");

        if (response && response.deleted) {
            console.log(`Bleep ${response.id} deleted`);
        }
    });

export default deleteBleepCommand;
