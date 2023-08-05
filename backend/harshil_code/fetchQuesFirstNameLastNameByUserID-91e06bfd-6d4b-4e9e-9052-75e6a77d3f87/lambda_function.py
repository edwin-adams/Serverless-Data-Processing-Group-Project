import boto3
import json

def lambda_handler(event, context):
    event_data = json.loads(event['body'])
    user_id = event_data['user_id']

    print(user_id)

    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table_name = 'users' 
    table = dynamodb.Table(table_name)

    response = table.get_item(
        Key={'firebase_user_id': user_id},
        ProjectionExpression='question1, question2, question3, first_name, last_name, image'
    )
    data = response.get('Item')

    print(response)

    if data:
        # If the data is found, return it
        return {
            'statusCode': 200,
            'body': json.dumps(data),
            "headers": {
                "Access-Control-Allow-Origin": "*",
            }
        }
    else:
        return {
            'statusCode': 404,
            'body': json.dumps(data),
            "headers": {
                "Access-Control-Allow-Origin": "*",
            }
        }
