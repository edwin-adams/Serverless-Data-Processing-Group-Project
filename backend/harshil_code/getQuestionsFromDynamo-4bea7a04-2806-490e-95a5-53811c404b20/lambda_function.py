import boto3
import json

def lambda_handler(event, context):

    try:
        dynamodb = boto3.client('dynamodb')

        # Define the parameters for the DynamoDB scan
        params = {
            'TableName': 'sdpQuestions',
        }

        response = dynamodb.scan(**params)
        print(response)
        data = response['Items']
        data = [item['question']['S'] for item in data]
        print(data)
        if data:
            return {
                'statusCode': 200,
                'body': json.dumps(data),
                "headers": {
                    "Access-Control-Allow-Origin": "*"
                }
            }
        else:
            return {
                'statusCode': 404,
                'body': json.dumps({'error': 'No data found'}),
                "headers": {
                    "Access-Control-Allow-Origin": "*"
                }
            }
    except Exception as e:
        print('Error fetching data from DynamoDB:', str(e))
        # Return an error response
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Internal Server Error'}),
            "headers": {
                "Access-Control-Allow-Origin": "*"
            }
        }