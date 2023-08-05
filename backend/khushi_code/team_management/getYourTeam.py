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
            
        target_email = event['email']
        filtered_items = [item for item in items if item["email"] == target_email]
        
        for item in filtered_items:
            item["status"] = bool(item["status"])  # Convert status to boolean
        
        print("Items for email", target_email, ":", filtered_items)

        return {
            'statusCode': 200,
            'body': filtered_items
        }
        
    except Exception as e:
        print("Error:", str(e))
        return None
