import assert from 'assert';
import { aiInvoke } from '../src/routes/ai.js';

// mock bedrock by monkeypatching invokeBedrock if needed

const mockBedrock = async ({ prompt }) => {
  // return valid JSON echo
  return JSON.stringify({ echo: true, prompt });
};

// patch the real invokeBedrock used inside ai.js by setting globalThis
import * as aiModule from '../src/routes/ai.js';
aiModule.invokeBedrock = mockBedrock;

const run = async () => {
  const event = {
    body: JSON.stringify({
      stockId: 's1',
      type: 'analysis',
      params: { year: 2026 },
      stock: { code: '000001', name: '平安银行', industry_74: '银行' }
    })
  };
  const res = await aiInvoke(event);
  assert.equal(res.statusCode, 200);
  const body = JSON.parse(res.body);
  assert.equal(body.cached, false);
  assert.ok(body.echo);
  console.log('ai.test.js ok');
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
