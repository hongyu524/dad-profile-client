import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const AWS_REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1';
const MODEL_ID = process.env.BEDROCK_MODEL_ID;

const client = new BedrockRuntimeClient({ region: AWS_REGION });

// Invoke Anthropic Claude (Messages API) on Bedrock.
// Returns the first text block string.
export const invokeBedrock = async (prompt, { systemText, temperature = 0, maxTokens = 1024 } = {}) => {
  if (!MODEL_ID) {
    throw new Error('BEDROCK_MODEL_ID is not set');
  }

  const body = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: maxTokens,
    temperature,
    messages: [
      {
        role: 'user',
        content: [{ type: 'text', text: prompt }]
      }
    ]
  };

  if (systemText) {
    body.system = systemText;
  }

  const command = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(body),
  });

  const response = await client.send(command);
  const text = new TextDecoder().decode(response.body);
  const parsed = JSON.parse(text);
  // Messages API returns {content:[{type:'text',text:'...'}], ...}
  const contentText =
    parsed?.content?.find?.((c) => c.type === 'text')?.text ??
    parsed?.output_text ??
    parsed?.completion ??
    text;
  return contentText;
};
