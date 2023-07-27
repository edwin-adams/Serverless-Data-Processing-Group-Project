import AWS, {AWSError} from 'aws-sdk';
import {AWSConfig, questionsDynamoTableName} from "../../CloudConfig/getAWSConfig";

AWS.config.update(AWSConfig);

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const getDataFromDynamo = async (): Promise<any[]> => {
    const params = {
        TableName: questionsDynamoTableName,
        // Add any filters or conditions if required
        // For example, KeyConditionExpression, FilterExpression, etc.
    };

    try {
        const data = await new Promise<any[]>((resolve, reject) => {
            dynamoDB.scan(params, (err: AWSError, data: AWS.DynamoDB.DocumentClient.ScanOutput) => {
                if (err) {
                    console.error('Error fetching data from DynamoDB:', err);
                    reject(err);
                } else {
                    console.log("Questions fetched from dynamo", data.Items);
                    resolve(data.Items || []);
                }
            });
        });

        return data;
    } catch (error) {
        console.error('Error fetching data from DynamoDB:', error);
        return [];
    }
};
