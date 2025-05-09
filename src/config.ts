import { config } from "dotenv";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// Load .env variables
config();

interface ServerConfig {
  port: number;
  ordiscanApiKey: string;
  configSources: {
    port: "cli" | "env" | "default";
    ordiscanApiKey: "env" | "missing";
  };
}

interface CliArgs {
  port?: number;
}

export function getServerConfig(isStdioMode = false): ServerConfig {
  const argv = yargs(hideBin(process.argv))
    .options({
      port: {
        type: "number",
        description: "Port to run the server on",
      },
    })
    .help()
    .version("0.1.0")
    .parseSync() as CliArgs;

  const config: ServerConfig = {
    port: 3000,
    ordiscanApiKey: process.env.ORDISCAN_API_KEY || "",
    configSources: {
      port: "default",
      ordiscanApiKey: process.env.ORDISCAN_API_KEY ? "env" : "missing",
    },
  };

  if (argv.port) {
    config.port = argv.port;
    config.configSources.port = "cli";
  } else if (process.env.PORT) {
    config.port = parseInt(process.env.PORT, 10);
    config.configSources.port = "env";
  }

  if (!isStdioMode) {
    console.log("\nConfiguration:");
    console.log(
      `- PORT: ${config.port} (source: ${config.configSources.port})`
    );
    if (config.ordiscanApiKey) {
      console.log("- ORDISCANN_API_KEY: [loaded from env]");
    } else {
      console.warn("- ORDISCANN_API_KEY: MISSING ⚠️");
    }
    console.log();
  }

  return config;
}
