import json
import boto3
from decimal import Decimal

def lambda_handler(event, context):
    user_id = event['queryStringParameters']['user_id']
    print(user_id)
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('users')
    projection_expression = '#games_played, win, loss, #total_points_earned'
    expression_attribute_names = {'#games_played': 'games played', '#total_points_earned': 'total points earned'}
    response = table.get_item(Key={'firebase_user_id': user_id},  ProjectionExpression=projection_expression,
    ExpressionAttributeNames=expression_attribute_names)


    print(response)
    # Check if the item exists
    if 'Item' in response:
        item = response['Item']
        
        print(item)
        
        item = {key: int(value) if isinstance(value, Decimal) else value for key, value in item.items()}
        
        print(item)
        
        if 'loss' not in item: 
            item['loss'] = 0
        if 'win' not in item: 
            item['win'] = 0
        if 'games played' not in item:
            item['games played'] = 0
        if 'total points earned' not in item:
            item['total points earned'] = 0

        
  
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Headers':'Content-Type',
                'Content-Type': 'application/json'
            },
            'body': json.dumps(item)
        }
    else:
        return {
            'statusCode': 404,
            'headers': {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Headers':'Content-Type',
                'Content-Type': 'application/json'
            },            
            'body': json.dumps({'error': 'User not found'})
        }
