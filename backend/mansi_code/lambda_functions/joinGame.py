import json
import boto3
from datetime import datetime, timedelta
import requests

def lambda_handler(event, context):
    # TODO implement
    try:
        print("event : " + str(event))
        print("HELLO MANSI")
        print(event["body"])
        print(type(event["body"]))
        data = json.loads(event["body"])
        print(type(data))
        game_id = data["game_id"]
        user_id = data["user_id"]
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('joinGameTable')
        all_data = table.scan()

        now = datetime.now()
        print(now)
        start_time = now + timedelta(minutes=2)
        print("TIME===>", start_time)

        for i in all_data["Items"]:

            if (i["game_id"] == game_id):
                start_time = i.get("start_time", start_time)
                print("INSIDE===>", start_time)
                print("TYPE===>", type(start_time))
                
            else:
                
                print("I am calling ues aii")
                response_pay = {
                    "game_id" : "hiii"
                } 
                set_question = "https://nb75pnutb6k75r3d3brs2rslkm0pkjxf.lambda-url.us-east-1.on.aws/"
                response = requests.post(set_question, json=response_pay)
                
                
    
        if len(all_data["Items"]) == 0:
            
            print("I am calling ues aii")
            response_pay = {
                "game_id" : game_id
            } 
            set_question = "https://nb75pnutb6k75r3d3brs2rslkm0pkjxf.lambda-url.us-east-1.on.aws/"
            response = requests.post(set_question, json=response_pay)

        response = table.put_item(
            Item={

                'game_id': game_id,
                'user_id': user_id,
                'start_time': str(start_time)
            }
        )
        print(response)
        print("END RESPONSE")
        return {
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': "GET,POST, PUT, DELETE",
                "Access-Control-Allow-Headers": "Content-Type",
                'Content-Type': 'application/json'

            },
            'statusCode': 200,
            'body': {
                'success': True
            }
        }


    except Exception as e:

        print("MANSI ERROR AAI" + str(e))

    return {
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': "GET,POST, PUT, DELETE",
            "Access-Control-Allow-Headers": "Content-Type",
            'Content-Type': 'application/json'
        },
        'statusCode': 200,
        'body': json.dumps('success')
    }
