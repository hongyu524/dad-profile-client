import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

const TABLE_NAME = process.env.TABLE_NAME;
const AWS_REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1';

if (!TABLE_NAME) {
  console.warn('TABLE_NAME env not set; DynamoDB calls will fail at runtime');
}

const client = new DynamoDBClient({ region: AWS_REGION });
export const ddb = DynamoDBDocumentClient.from(client);

export const ddbGet = (params) => ddb.send(new GetCommand({ TableName: TABLE_NAME, ...params }));
export const ddbPut = (params) => ddb.send(new PutCommand({ TableName: TABLE_NAME, ...params }));
export const ddbQuery = (params) => ddb.send(new QueryCommand({ TableName: TABLE_NAME, ...params }));
export const ddbDelete = (params) => ddb.send(new DeleteCommand({ TableName: TABLE_NAME, ...params }));
export const ddbScan = (params) => ddb.send(new ScanCommand({ TableName: TABLE_NAME, ...params }));
