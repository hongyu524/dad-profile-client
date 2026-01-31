import { defineConfig } from "sst/config";

export default defineConfig({
  config(_input) {
    return {
      name: "aws-backend",
      region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1",
    };
  },
  stacks(app) {
    app.stack("infra");
  },
});
