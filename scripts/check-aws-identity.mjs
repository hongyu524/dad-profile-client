"use strict";

import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";

const REGION = process.env.AWS_REGION || "us-west-2";
const EXPECTED = "user/stocks-app-importer";
const AWS_PROFILE = process.env.AWS_PROFILE;

async function main() {
  if (!AWS_PROFILE) {
    throw new Error("AWS_PROFILE is required (expected stocks-app-importer)");
  }
  const sts = new STSClient({ region: REGION });
  const ident = await sts.send(new GetCallerIdentityCommand({}));
  const arn = ident.Arn || "";
  if (!arn.includes(EXPECTED)) {
    throw new Error(`Wrong AWS identity. Expected ${EXPECTED}, got ${arn}`);
  }
  console.log(`AWS identity OK: ${arn}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
