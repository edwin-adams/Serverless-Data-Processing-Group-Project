import {AWSConfig, userTableName} from "../../CloudConfig/getAWSConfig";
import {UserModel} from "../user.model";
import AWS from "aws-sdk";

AWS.config.update(AWSConfig);

const dynamoDB = new AWS.DynamoDB.DocumentClient();


export const updateUserDetails = async (user: UserModel) => {
    const updateExpression = "SET #firstName = :firstNameValue, #lastName = :lastNameValue";

    const expressionAttributeNames = {
        "#firstName": "first_name",
        "#lastName": "last_name",
    };

    const expressionAttributeValues = {
        ":firstNameValue": user.first_name,
        ":lastNameValue": user.last_name,
    };

    const params = {
        TableName: userTableName,
        Key: {
            firebase_user_id: user.firebase_user_id,
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW", // This will return the updated item after the update is performed
    };

    try {
        const result = await dynamoDB.update(params).promise();
        console.log('Data successfully updated in DynamoDB:', result.Attributes);
        return true;
    } catch (error) {
        console.error('Error updating data in DynamoDB:', error);
        return false;
    }

};