const fs = require("fs");
const semver = require("semver");

const packageJsonPath = "./package.json";
const packageJson = require(packageJsonPath);

const newVersion = semver.inc(packageJson.version, "patch"); // You can change 'patch' to 'minor' or 'major'

packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log(`Bumped version to ${newVersion}`);