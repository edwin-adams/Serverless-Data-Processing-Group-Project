import boto3

# Create a DynamoDB resource
dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table_name = 'trivia_team'
    
    inviteId = event['inviteId']

    table = dynamodb.Table(table_name)

    try:
        table.delete_item(Key={'inviteId': inviteId})
        return {
            'statusCode': 200,
            'body': 'Item deleted successfully'
        }
        
    except Exception as e:
        print('Error deleting item:', e)
        return {
            'statusCode': 500,
            'body': 'Error deleting item'
        }
