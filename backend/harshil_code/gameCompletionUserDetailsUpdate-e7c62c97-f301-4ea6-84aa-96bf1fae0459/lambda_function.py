import boto3
import json

def lambda_handler(event, context):
    table_name = 'users'
    
    body = json.loads(event['body'])
    print(body)
    user_id = body['user_id']
    win = int(body['win']) == 1
    points = int(body['points'])
    
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table_name)
    
    try:
        response = table.get_item(Key={'firebase_user_id': user_id})
        item = response.get('Item', {})
        if item != {}:
            # current_value = item.get('games played', 0)
            # new_value = current_value + 1
            
            if win:
                current_value1 = item.get('win', 0)
                new_value1 = current_value1 + 1
            else:
                current_value1 = item.get('loss', 0)
                new_value1 = current_value1 + 1
                
            current_value2 = item.get('total points earned', 0)
            current_value2 = current_value2 + points
            # Step 6: Update the item in the table with the new value
            table.update_item(
                Key={'firebase_user_id': user_id},
                # col1 = :val1, 
                UpdateExpression='''SET 
                #col2 = :val2, #col3 = :val3''',
                ExpressionAttributeNames={
                    # '#col1': 'games played',
                    '#col2': 'win' if win else 'loss',
                    '#col3': 'total points earned'
                },
                ExpressionAttributeValues={
                    # ':val1': new_value,
                    ':val2': new_value1,
                    ':val3': current_value2
                }
            )
            
            return {
                'statusCode': 200,
                    'headers': {
                        'Access-Control-Allow-Origin': '*',  
                    },
                'body': 'Games status and points updated'
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
