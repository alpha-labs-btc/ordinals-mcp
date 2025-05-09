# Ordinals MCP Server 🔮

> 🔌 **Compatible with [Claude Desktop](https://claude.ai/desktop), [Cursor](https://cursor.sh), [VS Code](https://code.visualstudio.com/), [Cline](https://github.com/cline/cline), and other MCP clients.**
>
> This MCP server provides AI assistants with real-time access to the [Ordiscan](https://ordiscan.com) API for Runes, BRC-20 balances, and on-chain activity.

---

## ✨ Overview

The **Model Context Protocol (MCP)** enables AI assistants to call external tools like this server.
This tool bridges to [Ordiscan](https://ordiscan.com), offering:

- 💰 Runes & BRC-20 token balances
- 📜 On-chain transaction activity
- 🧠 MCP-standard tool interface (`get_rune_balance`, `get_brc20_activity`, etc.)

---

## ⚙️ Setup Options

### Option 1: Run via `npx` (no install)

```bash
ORDISCAN_API_KEY=your-api-key npx -y ordiscan-mcp --stdio
```

---

### Option 2: Install globally

```bash
npm install -g ordiscan-mcp
```

Then run:

```bash
ORDISCAN_API_KEY=your-api-key ordiscan-mcp --stdio
```

---

### Option 3: Run locally (recommended for development)

```bash
git clone https://github.com/your-org/ordiscan-mcp
cd ordiscan-mcp
npm install
```

Create a `.env` file:

```env
ORDISCAN_API_KEY=your-api-key
```

Then build and run:

```bash
npm run build
node build/index.js --stdio
```

---

## 🧠 Use with Claude Desktop (or other MCP clients)

You can register this tool in Claude as a **Stdio Tool**:

### Claude `.tools` JSON config

```json
{
  "command": "npx",
  "args": ["-y", "ordiscan-mcp", "--stdio"],
  "env": {
    "ORDISCAN_API_KEY": "your-api-key"
  },
  "type": "stdio",
  "port": 3000
}
```

Paste this into Claude Desktop under **Add Custom Tool → Stdio Tool**.

---

## 🛠️ Available Tools

| Tool ID              | Description                                  |
| -------------------- | -------------------------------------------- |
| `get_rune_balance`   | Returns Runes balance for a Bitcoin address  |
| `get_brc20_balance`  | Returns BRC-20 token balances for an address |
| `get_runes_activity` | Lists recent Runes transactions              |
| `get_brc20_activity` | Lists recent BRC-20 transactions             |

---

## 🔪 Development Workflow

```bash
npm run watch
```

Or manually:

```bash
npm run build
ORDISCAN_API_KEY=your-api-key node build/index.js --stdio
```

---

## 📝 License

MIT © Ordiscan MCP Team
