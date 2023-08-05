import json
import requests
import urllib.parse

def lambda_handler(event, context):
    
    print(event)
    total_score = 0

    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_ACCESS_TOKEN"
    }
    
    payload = {
        "teamName": event['inputTranscript'],
    }
    
    response = requests.post("https://r7h6msp1f2.execute-api.us-east-1.amazonaws.com/1/giveLexData", headers=headers, json=payload)
    if response.status_code == 200:
        response_content = response.json() 
        print(response_content)
        
        base_url = "https://jypdhmskqa.execute-api.ca-central-1.amazonaws.com/Prod/getScore"
        url = f"{base_url}?teamId={response_content}"
        print(url)
        message = f"Hello world {response_content}"
        print(message)
        # response_teamData = requests.get("https://rv7nzfzjhc.execute-api.ca-central-1.amazonaws.com/Prod/getScore?teamId=team_5", headers=headers)
        response_teamData = requests.get(url, headers=headers)
        print(response_teamData)

        if response_teamData.status_code == 200:
            responseTD = response_teamData.text
            responseTD = json.loads(responseTD)
            print(responseTD)
            for item in responseTD:
                print(item)
                if item['team_id'] == response_content:
                    total_score += item['score']

    message = f"This is a total score: \"{total_score}\""
    lex_response = {
        "sessionState": {
            "sessionAttributes": {
                "attributeName": "attributevalue"
            },
            "dialogAction": {
                "type": "Close"
            },
            "intent": {
                "state": "Fulfilled",
                "name": event["sessionState"]["intent"]["name"]
            }
        },
        "messages": [
            {
                "contentType": "PlainText",
                "content": message
            }
        ],
    }

    return lex_response