import {AWSConfig, userTableName} from "../../CloudConfig/getAWSConfig";
import AWS from "aws-sdk";

AWS.config.update(AWSConfig);

const dynamoDB = new AWS.DynamoDB.DocumentClient();

interface DataItem {
    firebase_user_id: string;
    first_name: string;
    last_name: string;
    question1: string;
    answer1: string;
    question2: string;
    answer2: string;
    question3: string;
    answer3: string;
    email: string;
}

export const putDataToDynamo = async (item: DataItem) => {
    console.log("Adding Item to Dynamo DB table:", userTableName, item);
    const params = {
        TableName: userTableName,
        Item: item,
    };

    try {
        await dynamoDB.put(params).promise();
        console.log('Data successfully stored in DynamoDB:', item);
        return true;
    } catch (error) {
        console.error('Error storing data in DynamoDB:', error);
        return false;
    }
};
