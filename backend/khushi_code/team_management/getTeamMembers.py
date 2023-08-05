import json
import boto3

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table_name = 'trivia_team'

    table = dynamodb.Table(table_name)

    try:
        response = table.scan()

        items = response['Items']
        while 'LastEvaluatedKey' in response:
            response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
            items.extend(response['Items'])
            
        target_team = event['teamId']
        filtered_items = [item for item in items if item["teamId"] == target_team and item["status"] == True]
        
        for item in filtered_items:
            item["status"] = bool(item["status"])  # Convert status to boolean
        
        print("Items for email", target_team, ":", filtered_items)

        return {
            'statusCode': 200,
            'body': filtered_items
        }
        
    except Exception as e:
        print("Error:", str(e))
        return None

