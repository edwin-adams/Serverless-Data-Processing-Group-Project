import boto3
import json

userTableName = "users"

dynamodb = boto3.resource("dynamodb")

def lambda_handler(event, context):
    body = event.get("body") 
    if not body:
        return {
            "statusCode": 400,
            "body": "Invalid request body",
            "headers": {
                "Access-Control-Allow-Origin": "*"
            }
        }
        
    item = json.loads(body)
    print(item)
    item['games played'] = 0
    item['win'] = 0
    item['loss'] = 0
    item['total points earned'] = 0
    result = put_data_to_dynamo(item)
    if result:
        return {
            "statusCode": 200,
            "body": "Data successfully stored in DynamoDB",
             "headers": {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods':"ALL",
                "Access-Control-Allow-Headers":"Authorization, Content-Type",
                'Content-Type': 'text/html',
            }
        }
    else:
        return {
            "statusCode": 500,
            "body": "Error storing data in DynamoDB",
            "headers": {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods':"ALL",
                "Access-Control-Allow-Headers":"Authorization, Content-Type",
                'Content-Type': 'text/html',
            }
        }


def put_data_to_dynamo(item):
    print("Adding Item to Dynamo DB table:", userTableName, item)
    table = dynamodb.Table(userTableName)

    try:
        table.put_item(Item=item)
        print("Data successfully stored in DynamoDB:", item)
        return True
    except Exception as e:
        print("Error storing data in DynamoDB:", e)
        return False