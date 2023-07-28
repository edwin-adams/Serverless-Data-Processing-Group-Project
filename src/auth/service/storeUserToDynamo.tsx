import {AWSConfig, userTableName} from "../../CloudConfig/getAWSConfig";
import AWS from "aws-sdk";
import {UserModel} from "../user.model";

AWS.config.update(AWSConfig);

const dynamoDB = new AWS.DynamoDB.DocumentClient();


export const putDataToDynamo = async (item: UserModel) => {
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
