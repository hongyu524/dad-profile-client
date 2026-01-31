import { StackContext, Api, Table, Function } from "sst/constructs";

export function InfraStack({ stack }: StackContext) {
  const table = new Table(stack, "AppData", {
    fields: {
      PK: "string",
      SK: "string",
      ttl: "number",
    },
    primaryIndex: { partitionKey: "PK", sortKey: "SK" },
    timeToLiveAttribute: "ttl",
  });

  const fn = new Function(stack, "ApiHandler", {
    handler: "src/handler.handler",
    runtime: "nodejs20.x",
    environment: {
      TABLE_NAME: table.tableName,
      BEDROCK_MODEL_ID: process.env.BEDROCK_MODEL_ID || "",
      AWS_REGION: stack.region,
    },
    bind: [table],
    timeout: 30,
  });

  const api = new Api(stack, "HttpApi", {
    defaults: {
      function: {
        bind: [table],
      },
    },
    cors: {
      allowOrigins: ["http://localhost:5173", "https://<cloudfront-domain>"],
      allowHeaders: ["content-type", "authorization"],
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
