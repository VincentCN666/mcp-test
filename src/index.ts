import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// 创建服务器实例
const server = new McpServer({
  name: "mcp-test",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// 添加一个简单的测试工具
server.tool(
  "hello",
  "返回问候消息",
  {
    name: z.string().describe("要问候的名字"),
  },
  async ({ name }) => {
    return {
      content: [
        {
          type: "text",
          text: `你好，${name}！`,
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  await new Promise((resolve) => {
    server.onClose(() => {
      resolve(null);
    });
  });
}

main().catch((error) => {
  console.error("服务器运行出错:", error);
  process.exit(1);
});
