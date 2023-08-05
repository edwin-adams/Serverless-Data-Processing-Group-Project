import boto3
import requests
import json

import time


def lambda_handler(event, context):
    # TODO implement
    print("event : "+str(event["body"]))
    game_id = json.loads(event["body"])["game_id"]
    # game_id = event["body"]["game_id"]
    URL = "https://tunjietnw4.execute-api.us-east-1.amazonaws.com/games"
    r = requests.get(url = URL)
    print(r.text)
    payload_response = json.loads(r.text)
    result = convert_payload(payload_response)
    
    
    # Get the current time in epoch (seconds since January 1, 1970)
    current_time_epoch = int(time.time())

    # Add 2 minutes (120 seconds) to the current time
    two_minutes_later_epoch = current_time_epoch + 120
    print(two_minutes_later_epoch)
    print(result)
    response_pay = {
    "startTime": two_minutes_later_epoch * 1000,
    "gameId": game_id,
    "gameName": "History",
    "questions" : result[:5]
        
    }
    
    set_question = "https://rv7nzfzjhc.execute-api.ca-central-1.amazonaws.com/Prod/setQuestion"
    response = requests.post(set_question, json=response_pay)
    
    return {
        'statusCode': 200,
        'body': response_pay
    }

def convert_payload(payload):
    converted_data = []
    for game in payload:
        for question in game["questions"]:
            converted_question = {
                "question": question["Content"],
                "answers": question["Options"],
                "hint": question["Hint"],
                "explanation": f"{question['Options'][question['AnswerIndex']]} is the correct answer.",
                "correctAnswer": question["AnswerIndex"]
            }
            converted_data.append(converted_question)
    return converted_data