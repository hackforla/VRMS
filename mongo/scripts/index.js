const yargs = require("yargs");
const fs = require("fs");
const { generateEmployees } = require("./employees.js");

// Define Command
const argv = yargs.command("amount", "Decides the number of records to generate", {
    type: {
      description: "the type of record to generate",
      alias: "t",
      type: "string"
    },
    amount: {
      description: "The amount to generate",
      alias: "a",
      type: "number"
    },
  })
  .help()
  .alias("help", "h").argv;

if(!argv.hasOwnProperty("type")) throw new Error("Document type not specified.");
if(!argv.hasOwnProperty("amount") || argv.amount < 1) throw new Error("Amount of records to create not specified.");

const type = argv.type.toLowerCase();
const amount = argv.amount;

// Generate Employee data
if (type === "employee") {
  const employees = generateEmployees(amount);
  const json = JSON.stringify(employees);
  fs.writeFileSync("./data/employees.json", json);
  return;
}

// Handle non-supported document types
throw new Error(`Document type: '${type}' not supported.`);
