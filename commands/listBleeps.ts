import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.2/command/command.ts";
import { Table } from "https://deno.land/x/cliffy@v1.0.0-rc.2/table/mod.ts";
import { keypress } from "https://deno.land/x/cliffy@v1.0.0-rc.2/keypress/mod.ts";
import { airtable } from "../index.ts";
import { FieldShape } from "../types.ts";

function incrementOffset(pageSize: number, offset: number): number {
  return pageSize + offset;
}

let offset = 0;

async function getRecords(maxRecords: number, pageSize: number) {
  const response = await airtable.select<
    FieldShape<{
      Title: string;
      Content: string;
      Date: string;
    }>
  >({
    maxRecords,
    pageSize,
    offset,
  });

  const tableRows = [];
  for (const record of response) {
    tableRows.push([
      record.id,
      record.fields.Title,
      record.fields.Content,
      record.fields.Date,
    ]);
  }

  Table.from(tableRows).header(["ID", "Title", "Content", "Date"]).border()
    .render();
}

const listBleepsCommand = new Command()
  .description("Retrieve bleeps")
  .option("-p, --pageSize <page:number>", "Page size", {
    default: 10,
  })
  .option("-n, --num <num:number>", "Max number of bleeps to retrieve", {
    default: 10,
  })
  .action(async ({ num, pageSize }) => {
    console.log(
      `Retrieving up to ${num} records with page size ${pageSize}...`,
    );

    await getRecords(num, pageSize);

    console.log("Press enter to load more bleeps, or q to quit");

    for await (const event of keypress()) {
      if (event.key === "return") {
        offset = incrementOffset(num, offset);
        await getRecords(num, pageSize);
      }
      if (event.key === "q") {
        break;
      }
    }
  });

export default listBleepsCommand;
