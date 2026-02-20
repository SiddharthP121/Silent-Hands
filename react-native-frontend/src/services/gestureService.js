import { ScanCommand } from '@aws-sdk/client-dynamodb';
import {dbClient, s3Client, BUCKET_NAME} from './awsConfig'
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const TABLE_NAME = 'silenthands_Gestures';

export const getAllGestures = async () => {
  try {
    const { Items } = await dbClient.send(
      new ScanCommand({ TableName: TABLE_NAME }),
    );

    // Tell TypeScript these are objects we can work with
    const cleanData = (Items || []).map(item => unmarshall(item));

    const gesturesWithImages = await Promise.all(
      cleanData.map(async gesture => {
        const command = new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: gesture.file_path,
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        return {
          ...gesture,
          imageUrl: url, 
        };
      }),
    );

    return gesturesWithImages;
  } catch (error) {
    console.error('Unable to fetch gestures:', error);
    return [];
  }
};
