import { ScanCommand } from "@aws-sdk/client-dynamodb"
import { BUCKET_NAME, dbClient, S3Client } from "./awsConfig"
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


const TABLE_NAME = 'silenthands Gestures';

export const getAllGestures = async() => {
  try {
    const {Items} = await dbClient.send(new ScanCommand({TableName: TABLE_NAME})) //To obtain all items from table
    const cleanData = Items.map((item)=>unmarshall(item)) // to convert it into the json
    const gesturesWithImages = await Promise.all(  //getting all the gestures
        cleanData.map(async(gesture)=>{
            const command = new GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: gesture.file_path  ,
            })
            const url = await getSignedUrl(S3Client, command, {expiresIn: 3600})
            return {...gesture, image_url : url}
        })
    )
    return gesturesWithImages;
  } catch (error) {
    console.error('Unable to fetch gestures')
    return []
  } 
}
