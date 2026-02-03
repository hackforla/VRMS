//import node modules for running shell commands and handling files, define file names
import { execSync } from "child_process";
import fs from "fs";
const reportFile = "lint-report.json";
const countFile = "lint-files.count.txt";

// Generate report
const generateReports = (results, exitCode) => {
  const countContent = `After running the lint found total number of the files has linting problems: ${results.length}`;
  fs.writeFileSync(countFile, countContent, "utf-8");
  console.log(
    `Found ${results.length} files with linting errors. Total written to ${countFile}`,
  );

  const modifiedResults = results.map((result) => {
    const vrmsIndex = result.filePath.indexOf("VRMS");
    const relativePath = result.filePath.substring(vrmsIndex + 4);
    return { ...result, filePath: relativePath };
  });

  const formattedJson = JSON.stringify(modifiedResults, null, 2);
  fs.writeFileSync(reportFile, formattedJson, "utf-8");

  console.log(`Lint report created: ${reportFile}`);
  process.exit(exitCode);
};

try {
  const stdout = execSync("npx eslint . --format json").toString();
  const results = JSON.parse(stdout);
  generateReports(results, 0);
} catch (error) {
  let results;
  try {
    const stdout = error.stdout.toString();
    results = JSON.parse(stdout);
  } catch (parseError) {
    console.error(
      "Failed to parse ESLint output. The output was not valid JSON.",
    );
    console.error("Error details:", parseError.message);
    console.error("Raw output:", error.stdout.toString());
    process.exit(1);
  }
  generateReports(results, 1);
}
