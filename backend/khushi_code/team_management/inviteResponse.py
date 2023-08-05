import json
import boto3

dynamodb = boto3.resource('dynamodb')
table_name = 'trivia_team'
table = dynamodb.Table(table_name)
def lambda_handler(event, context):
    
    response = event['response']
    uuid = event['uuid']
    
    if response:
        table.update_item(
            Key={'inviteId': uuid},
            UpdateExpression='SET #s = :val',
            ExpressionAttributeNames={'#s': 'status'},
            ExpressionAttributeValues={':val': response}
        )
    else: 
        table.update_item(
            Key={'inviteId': uuid},
            UpdateExpression='SET #s = :val',
            ExpressionAttributeNames={'#s': 'declined'},
            ExpressionAttributeValues={':val': 'true'}
        )        

    
    # TODO implement
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
