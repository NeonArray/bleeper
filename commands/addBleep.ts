import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.2/command/command.ts";
import { Input } from "https://deno.land/x/cliffy@v1.0.0-rc.2/prompt/mod.ts";
import { airtable } from "../index.ts";
import { interrogateError } from "../utils.ts";
import { Bleep, BleepsRequest } from "../types.ts";

const addBleepCommand = new Command()
    .description("Send a Bleep")
    .option("-t, --title <title:string>", "Bleep Title")
    .option("-c, --content <content:string>", "Bleep Content")
    .action(async ({ title, content }) => {
        if (!title) {
            title = await Input.prompt({
                message: "Bleep Title:",
                minLength: 1,
            });
        }
        if (!content) {
            content = await Input.prompt({
                message: "Bleep Content:",
                minLength: 1,
            });
        }

        const bleep: Bleep = {
            "Title": title,
            "Content": content,
            "Date": new Date().toISOString(),
        };
        const data: BleepsRequest = {
            "records": [
                {
                    "fields": bleep,
                },
            ],
        };
        const response = await airtable.create(data);

        interrogateError(response, "Failed to create bleep");

        if (response && response.records) {
            console.log(`Bleep created with ID ${response.records[0].id}`);
        }
    });

export default addBleepCommand;
