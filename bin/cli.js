#!/usr/bin/env node
const { execSync } = require("child_process");

const runCommand = (command) => {
    try {
        execSync(`${command}`, { stdio: "inherit" });
    } catch (e) {
        console.error(`failed to execute ${command}`, e);
        return false;
    }

    return true;
};

const repoName = process.argv[2];
const gitCheckoutCommand = `git clone --depth 1 https://github.com/RiadhAdrani/create-recursive-app ${repoName}`;
const installDepsCommand = `cd ${repoName} && npm install`;
const deleteGit = `cd ${repoName} && rmdir /s .git`;
const deleteBin = `cd ${repoName} && rmdir /s bin`;
const gitInit = `cd ${repoName} && git init`;

console.log(`Cloning the repository with name ${repoName}`);
const checkOut = runCommand(gitCheckoutCommand);
if (!checkOut) process.exit(-1);

console.log(`Installing dependencies for ${repoName}`);
const installDeps = runCommand(installDepsCommand);
if (!installDeps) process.exit(-1);

console.log(`Removing .git`);
const removeDotGit = runCommand(deleteGit);
if (!removeDotGit) process.exit(-1);

console.log(`Removing bin`);
const removeBin = runCommand(deleteBin);
if (!removeBin) process.exit(-1);

console.log(`Initializing new git repository`);
const initializeGit = runCommand(gitInit);
if (!initializeGit) process.exit(-1);

console.log("congratulation! You are ready to use Recursive!");
console.log(`cd ${repoName} && npm start`);
