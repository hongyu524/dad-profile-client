import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { StackContext, Api, Table, Function } from "sst/constructs";

export function InfraStack({ stack }: StackContext) {
  const table = new Table(stack, "AppData", {
    cdk: {
      table: dynamodb.Table.fromTableName(stack, "ImportedAppData", "AppData"),
    },
  });

  const fn = new Function(stack, "ApiHandler", {
    handler: "src/handler.handler",
    runtime: "nodejs22.x",
    copyFiles: [{ from: "prompts", to: "prompts" }],
    environment: {
      TABLE_NAME: table.tableName,
      AI_PROVIDER: "openai",
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "",
      OPENAI_MODEL: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      OPENAI_MAX_OUTPUT_TOKENS: process.env.OPENAI_MAX_OUTPUT_TOKENS ?? "800",
      OPENAI_TEMPERATURE: process.env.OPENAI_TEMPERATURE ?? "0.2",
    },
    bind: [table],
    timeout: 30,
  });

  const api = new Api(stack, "HttpApi", {
    cors: {
      allowOrigins: ["http://localhost:5173", "https://zhoutianming.store"],
      allowHeaders: ["content-type", "authorization", "x-api-key", "x-family-code"],
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      maxAge: "1 day",
    },
    routes: {
      "GET /stocks": fn,
      "POST /stocks": fn,
      "PUT /stocks/{id}": fn,
      "DELETE /stocks/{id}": fn,
      "GET /industries": fn,
      "POST /industries": fn,
      "PUT /industries/{id}": fn,
      "DELETE /industries/{id}": fn,
      "POST /screen/holdings": fn,
      "POST /ai/invoke": fn,
    },
  });

  stack.addOutputs({
    ApiUrl: api.url,
    TableName: table.tableName,
    CloudFrontAllowedOrigins: "http://localhost:5173, https://<cloudfront-domain>",
  });
}
