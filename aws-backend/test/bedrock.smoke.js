import assert from 'assert';
import { invokeBedrock } from '../src/lib/bedrock.js';

const model = process.env.BEDROCK_MODEL_ID;

const run = async () => {
  if (!model) {
    console.log('BEDROCK_MODEL_ID not set; skipping smoke test.');
    return;
  }
  const prompt = 'Return ONLY valid JSON: {"ok":true}';
  const text = await invokeBedrock(prompt, { maxTokens: 50, temperature: 0 });
  const parsed = JSON.parse(text);
  assert.deepStrictEqual(parsed, { ok: true });
  console.log('bedrock.smoke OK', parsed);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
