import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import yaml from "js-yaml";
import { z } from "zod";
import { Logger } from "./logger.js";
import { Ordiscan } from "ordiscan";

export class OrdiscanMcpServer extends McpServer {
  private ordiscan: Ordiscan;

  constructor(apiKey: string) {
    super(
      { name: "Ordinals MCP Server", version: "0.1.0" },
      { capabilities: { logging: {}, tools: {} } }
    );

    this.ordiscan = new Ordiscan(apiKey);
    this.registerTools();
  }

  private registerTools(): void {
    const AddressSchema = z.object({
      address: z.string().describe("Bitcoin address to query"),
    });

    // Runes Balance
    this.tool(
      "get_rune_balance",
      "Returns Runes balance for a specific Bitcoin address.",
      AddressSchema.shape,
      async ({ address }) => {
        try {
          const data = await this.ordiscan.address.getRunes({ address });
          return { content: [{ type: "text", text: yaml.dump(data) }] };
        } catch (err) {
          Logger.error(`Rune balance error:`, err);
          return this.errorContent(err);
        }
      }
    );

    // BRC-20 Balance
    this.tool(
      "get_brc20_balance",
      "Returns BRC-20 token balances for a specific Bitcoin address.",
      AddressSchema.shape,
      async ({ address }) => {
        try {
          const data = await this.ordiscan.address.getBrc20Tokens({ address });
          return { content: [{ type: "text", text: yaml.dump(data) }] };
        } catch (err) {
          Logger.error(`BRC-20 balance error:`, err);
          return this.errorContent(err);
        }
      }
    );

    const ActivitySchema = z.object({
      address: z.string().describe("Bitcoin address to query"),
      page: z.number().optional().describe("Page number (optional)"),
      sort: z.enum(["newest", "oldest"]).optional().describe("Sort order"),
    });

    // Runes Activity
    this.tool(
      "get_runes_activity",
      "Returns Runes transaction history for a Bitcoin address.",
      ActivitySchema.shape,
      async ({ address, page, sort }) => {
        try {
          const data = await this.ordiscan.address.getRunesActivity({
            address,
            page,
            sort,
          });
          return { content: [{ type: "text", text: yaml.dump(data) }] };
        } catch (err) {
          Logger.error(`Runes activity error:`, err);
          return this.errorContent(err);
        }
      }
    );

    // BRC-20 Activity
    this.tool(
      "get_brc20_activity",
      "Returns BRC-20 transaction history for a Bitcoin address.",
      ActivitySchema.shape,
      async ({ address, page, sort }) => {
        try {
          const data = await this.ordiscan.address.getBrc20Activity({
            address,
            page,
            sort,
          });
          return { content: [{ type: "text", text: yaml.dump(data) }] };
        } catch (err) {
          Logger.error(`BRC-20 activity error:`, err);
          return this.errorContent(err);
        }
      }
    );
  }

  private errorContent(err: unknown) {
    return {
      isError: true,
      content: [
        {
          type: "text" as const,
          text: `Error: ${err instanceof Error ? err.message : String(err)}`,
        },
      ],
    };
  }

  async connect(transport: Transport): Promise<void> {
    await super.connect(transport);

    const originalStdoutWrite = process.stdout.write.bind(process.stdout);
    process.stdout.write = (chunk: any, encoding?: any, callback?: any) => {
      if (typeof chunk === "string" && !chunk.trim().startsWith("{")) {
        return true; // suppress non-JSON stdout
      }
      return originalStdoutWrite(chunk, encoding, callback);
    };

    Logger.log("Solana QuickNode MCP server is running.");
  }
}
