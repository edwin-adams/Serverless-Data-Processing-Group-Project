import boto3
import json

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table_name = 'trivia_team'
    
    # query_params = event.get("queryStringParameters")

    # email = query_params.get("user_email")
    table = dynamodb.Table(table_name)

    print(event)
    print(context)
    
    query_params = event.get("queryStringParameters")
    email = query_params.get("user_email")
    print(email)
    
    try:
        response = table.scan()
        
        items = response.get("Items", [])

        team_details = [
            {
                "team_id": item["teamId"],
                "team_name": item["teamName"],
                "invite_id": item["inviteId"]
            }
            for item in items
            if item.get("email") == email
        ]

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Headers':'Content-Type',
                'Content-Type': 'application/json'
            },
            "body": json.dumps({
                "data" : team_details
            })
        }
        
    except Exception as e:
        print("Error:", str(e))
        return None
