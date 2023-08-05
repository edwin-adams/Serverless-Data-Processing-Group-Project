import boto3
import json

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table_name = 'trivia_team'
    
    table = dynamodb.Table(table_name)
    event = json.loads(event["body"])
    email_id = event["user_id"]
    teamId = event["team_id"]
    
    try:
        response = table.scan(
            FilterExpression="email = :email AND teamId = :teamId",
            ExpressionAttributeValues={":email": email_id, ":teamId": teamId}
        )
        
        print(response)
        count = response['Count']
        
        if count == 0:
            return {
            "statusCode": 400,
            "body": json.dumps({
                "message": "The given user does not exist"
            })
        }
        else: 
            for item in response['Items']:
                print(item)
                res = table.delete_item(Key={'inviteId': item['inviteId']})
                print(res)

            return {
                "statusCode": 200,
                "body": json.dumps({
                    "message": "Items deleted successfully"
                })
            }           

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({
                "error": str(e)
            })
        }
    
    except Exception as e:
        print("Error:", str(e))
        return None
