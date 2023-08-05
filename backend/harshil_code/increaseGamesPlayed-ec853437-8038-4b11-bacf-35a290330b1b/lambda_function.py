import boto3
import json

def lambda_handler(event, context):
    table_name = 'users'
    
    body = json.loads(event['body'])
    user_id = body['user_id']
    
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table_name)
    
    try:
        response = table.get_item(Key={'firebase_user_id': user_id})
        item = response.get('Item', {})
        if item != {}:
            current_value = item.get('games played', 0)
            new_value = current_value + 1
            
            # Step 6: Update the item in the table with the new value
            table.update_item(
                Key={'firebase_user_id': user_id},
                UpdateExpression='SET #colname = :val',
                ExpressionAttributeNames={'#colname': 'games played'},  
                ExpressionAttributeValues={':val': new_value}
            )
            
            return {
                'statusCode': 200,
                    'headers': {
                        'Access-Control-Allow-Origin': '*',  
                    },
                'body': 'Games played value increased by 1 successfully.'
            }
        else:
            return {
                'statusCode': 203,
                    'headers': {
                        'Access-Control-Allow-Origin': '*',  
                    },
                'body': 'User did not found. ID: ' + user_id
            }
    except Exception as e:
        return {
            'statusCode': 500,
                'headers': {
                    'Access-Control-Allow-Origin': '*',  
                },
            'body': str(e)
        }
