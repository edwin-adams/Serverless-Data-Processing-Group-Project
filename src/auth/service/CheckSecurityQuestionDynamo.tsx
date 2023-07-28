import AWS from 'aws-sdk';
import {AWSConfig, userTableName} from "../../CloudConfig/getAWSConfig";

export const checkSecurityQuestionDynamo = async (user_id: string, a1: string, a2: string, a3: string) => {
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
        ProjectionExpression: 'firebase_user_id, first_name, last_name, answer1, answer2, answer3, email',
        limit: 1
    };

    try {
        const data = await dynamoDB.scan(params).promise();
        console.log(data.Items[0]);
        console.log(data.Items[0].answer1, a1, data.Items[0].answer2, a2, data.Items[0].answer3, a3);
        if (data.Items[0].answer1 === a1 && data.Items[0].answer2 === a2 && data.Items[0].answer3 === a3) {
            localStorage.setItem('user', JSON.stringify({user_id: data.Items[0].firebase_user_id, first_name: data.Items[0].first_name, last_name: data.Items[0].last_name, email: data.Items[0].email}));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error fetching data from DynamoDB:', error);
        return false;
    }
};
