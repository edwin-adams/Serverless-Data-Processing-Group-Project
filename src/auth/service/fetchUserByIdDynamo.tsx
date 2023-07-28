import AWS from 'aws-sdk';
import {AWSConfig, userTableName} from "../../CloudConfig/getAWSConfig";

const fetchUserByIdDynamo = async (user_id: string) => {
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
        ProjectionExpression: 'question1, question2, question3, first_name, last_name',
        limit: 1
    };

    try {
        const data = await dynamoDB.scan(params).promise();
        console.log(data.Items[0]);
        return data.Items[0];
    } catch (error) {
        console.error('Error fetching data from DynamoDB:', error);
        return [];
    }
};

export default fetchUserByIdDynamo;
