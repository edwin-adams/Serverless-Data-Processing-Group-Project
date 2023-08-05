import json
import boto3
# from boto3.dynamodb.conditions import Key

def lambda_handler(event, context):
    # TODO implement
        
    try: 
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('game_type')
        
        # response = table.query(KeyConditionExpression=Key("game_id"))
        
        all_data = table.scan()
        
        return {
            'statusCode': 200,
            'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods':"GET,POST, PUT, DELETE",
            "Access-Control-Allow-Headers":"Content-Type",
            'Content-Type': 'application/json',
      
            },
            'body': {
                "all_data" : all_data
            }
         
        }
    except Exception as e:
        
        return {
            'statusCode': 500,
            # 'headers': {
         
        #   'Access-Control-Allow-Origin': '*',
        #     'Access-Control-Allow-Methods':"GET,POST, PUT, DELETE",
        #     "Access-Control-Allow-Headers":"Authorization, Content-Type",
        #     'Content-Type': 'text/html',
        #     '
        #     },
            'body': {
                "all_data" : {}
            }
        }
