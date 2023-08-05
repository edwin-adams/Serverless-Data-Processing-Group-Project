import json
import boto3

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table_name = 'trivia_team'

    table = dynamodb.Table(table_name)
    
    inviteId = event['inviteId']

    try:
        table.update_item(
            Key={'inviteId': inviteId},
            UpdateExpression='SET #s = :val',
            ExpressionAttributeNames={'#s': 'isAdmin'},
            ExpressionAttributeValues={':val': True}
        )
        return {
            'statusCode': 200,
            'body': json.dumps('Promoted')
        }

        
    except Exception as e:
        print("Error:", str(e))
        return None

s