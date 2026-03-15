import { Command } from "commander";
import { generateMnemonic } from "../core/wallet";

const program = new Command();

program
    .name("wallet")
    .description("CLI multi-chain crypto wallet")
    .version("0.1.0");

program
    .command("hello")
    .description("Test the CLI")
    .action(() => {
        console.log("Wallet CLI is working.");
    });

program
    .command("create")
    .description("Create a new wallet seed phrase")
    .action(() => {
        const mnemonic = generateMnemonic();

        console.log("\n=== NEW WALLET SEED ===\n");
        console.log(mnemonic);
        console.log("\nSave this phrase securely. Anyone with it can access your funds.\n");
    });

program.parse(process.argv);

