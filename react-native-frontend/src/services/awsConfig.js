import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentity } from "@aws-sdk/credential-providers";

const REGION = 'ap-south-1';
const credientials = fromCognitoIdentity({
  clientConfig: { region: REGION },
  identityPoolId: 'ap-south-1:c17f5eae-2459-48db-8897-1f124fffe86e',
});

export const S3Client = new S3Client({region: REGION, credientials})
export const dbClient = new DynamoDBClient({region: REGION, credientials})
export const BUCKET_NAME = 'sign-language-backet';