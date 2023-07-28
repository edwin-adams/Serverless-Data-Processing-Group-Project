import AWS from 'aws-sdk';
import {AWSConfig, userTableName} from "../../CloudConfig/getAWSConfig";

export const checkDynamoEntry = async (user_id: string) => {
    // Configure AWS credentials and region (if not already configured globally)
    AWS.config.update(AWSConfig);

    // Create an instance of DynamoDB DocumentClient
    const dynamoDB = new AWS.DynamoDB.DocumentClient();

    // Define the parameters for the DynamoDB query or scan
    const params = {
        TableName: userTableName,
        FilterExpression: 'firebase_user_id = :uid',
        ExpressionAttributeValues: {
            ':uid': user_id,
        },
        ProjectionExpression: 'email',
        limit: 1
    };

    try {
        const data = await dynamoDB.scan(params).promise();
        console.log(data.Items[0]);
        return data.Items.length === 1;
    } catch (error) {
        console.error('Error fetching data from DynamoDB:', error);
        return false;
    }
};
