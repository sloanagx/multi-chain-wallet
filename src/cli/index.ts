import { Command } from "commander";
import { generateMnemonic } from "../core/wallet";
import { importMnemonic } from "../core/wallet";
import { deriveEthereumWallet } from "../chains/ethereum/wallet";
import { saveEncryptedWallet, loadEncryptedWallet } from "../storage/encrypted";
import { deriveBitcoinWallet } from "../chains/bitcoin/wallet";
import { deriveSolanaWallet } from "../chains/solana/wallet";
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

program
    .command("import")
    .description("Import an existing wallet from a seed phrase")
    .argument("<mnemonic...>", "Seed phrase (space separated)")
    .action((mnemonicWords: string[]) => {
        const mnemonic = mnemonicWords.join(" ");

        try {
            const validMnemonic = importMnemonic(mnemonic);
            const ethWallet = deriveEthereumWallet(validMnemonic);

            console.log("\n=== IMPORTED WALLET ===\n");
            
            console.log("Ethereum Address:\n");
            console.log(ethWallet.address);

            console.log("\nWallet successfully loaded.\n");
        } catch (err: any) {
            console.error("\nError:", err.message);
        }
    });

program
  .command("address")
  .description("Derive an Ethereum address from a seed phrase")
  .argument("<mnemonic...>", "Seed phrase (space separated)")
  .option("-i, --index <number>", "Account index", "0")
  .action((mnemonicWords: string[], options: { index: string }) => {
    const mnemonic = mnemonicWords.join(" ");

    try {
      const validMnemonic = importMnemonic(mnemonic);
      const index = Number.parseInt(options.index, 10);

      if (Number.isNaN(index) || index < 0) {
        throw new Error("Index must be a non-negative integer");
      }

      const ethWallet = deriveEthereumWallet(validMnemonic, index);

      console.log("\n=== ETHEREUM ADDRESS ===\n");
      console.log(`Index: ${ethWallet.index}`);
      console.log(`Path: ${ethWallet.path}`);
      console.log(`Address: ${ethWallet.address}\n`);
    } catch (err: any) {
      console.error("\nError:", err.message);
    }
  });

program
  .command("save")
  .description("Encrypt and save a wallet locally")
  .argument("<mnemonic...>", "Seed phrase")
  .requiredOption("-p, --password <password>", "Encryption password")
  .action(async (mnemonicWords: string[], options: {password: string }) => {
    const mnemonic = mnemonicWords.join(" ");

    try {
        const validMnemonic = importMnemonic(mnemonic);

        await saveEncryptedWallet(validMnemonic, options.password);

        console.log("\nWallet saved securely to .wallet/wallet.json\n");
    }   catch (err: any) {
        console.error("\nError:", err.message);
    }
  });

  program
  .command("load")
  .description("Load wallet from encrypted storage")
  .requiredOption("-p, --password <password>", "Decryption password")
  .option("-i, --index <number>", "Account index", "0")
  .action(async (options: { password: string; index: string }) => {
    try {
      const mnemonic = await loadEncryptedWallet(options.password);

      const index = Number.parseInt(options.index, 10);
      const ethWallet = deriveEthereumWallet(mnemonic, index);

      console.log("\n=== LOADED WALLET ===\n");
      console.log(`Index: ${ethWallet.index}`);
      console.log(`Address: ${ethWallet.address}\n`);
    } catch (err: any) {
      console.error("\nError:", err.message);
    }
  });

  program
  .command("btc-address")
  .description("Derive a Bitcoin address from a seed phrase")
  .argument("<mnemonic...>", "Seed phrase")
  .option("-i, --index <number>", "Account index", "0")
  .action((mnemonicWords: string[], options: { index: string }) => {
    const mnemonic = mnemonicWords.join(" ");

    try {
      const validMnemonic = importMnemonic(mnemonic);
      const index = Number.parseInt(options.index, 10);

      const btcWallet = deriveBitcoinWallet(validMnemonic, index);

      console.log("\n=== BITCOIN ADDRESS ===\n");
      console.log(`Index: ${btcWallet.index}`);
      console.log(`Path: ${btcWallet.path}`);
      console.log(`Address: ${btcWallet.address}\n`);
    } catch (err: any) {
      console.error("\nError:", err.message);
    }
  });

  program
  .command("sol-address")
  .description("Derive a Solana address from a seed phrase")
  .argument("<mnemonic...>", "Seed phrase")
  .option("-i, --index <number>", "Account index", "0")
  .action((mnemonicWords: string[], options: { index: string }) => {
    const mnemonic = mnemonicWords.join(" ");

    try {
      const validMnemonic = importMnemonic(mnemonic);
      const index = Number.parseInt(options.index, 10);

      const solWallet = deriveSolanaWallet(validMnemonic, index);

      console.log("\n=== SOLANA ADDRESS ===\n");
      console.log(`Index: ${solWallet.index}`);
      console.log(`Path: ${solWallet.path}`);
      console.log(`Address: ${solWallet.address}\n`);
    } catch (err: any) {
      console.error("\nError:", err.message);
    }
  });

  program
  .command("derive")
  .description("Derive an address for a specific chain")
  .requiredOption("-c, --chain <chain>", "Chain: eth | btc | sol")
  .option("-i, --index <number>", "Account index", "0")
  .argument("<mnemonic...>", "Seed phrase")
  .action(
    (
      mnemonicWords: string[],
      options: { chain: string; index: string }
    ) => {
      const mnemonic = mnemonicWords.join(" ");

      try {
        const validMnemonic = importMnemonic(mnemonic);
        const index = Number.parseInt(options.index, 10);

        let result;

        switch (options.chain) {
          case "eth":
            result = deriveEthereumWallet(validMnemonic, index);
            break;
          case "btc":
            result = deriveBitcoinWallet(validMnemonic, index);
            break;
          case "sol":
            result = deriveSolanaWallet(validMnemonic, index);
            break;
          default:
            throw new Error("Unsupported chain. Use eth, btc, or sol.");
        }

        console.log(`\n=== ${options.chain.toUpperCase()} ADDRESS ===\n`);
        console.log(`Index: ${result.index}`);
        console.log(`Path: ${result.path}`);
        console.log(`Address: ${result.address}\n`);
      } catch (err: any) {
        console.error("\nError:", err.message);
      }
    });
program.parse(process.argv);

