import json
import boto3

def lambda_handler(event, context):
    
    teamName = event["teamName"]
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table_name = 'trivia_team'
    
    table = dynamodb.Table(table_name)
    
    print(teamName)
    print(type(teamName))
    
    teamdId = None
    
    response = table.scan()
    print(response)
    response = response["Items"]
    print(response)
    
    for item in response:
        print("inside for")
        print(item)
        if item['teamName'] == teamName:
            print("inside if")
            print(item['teamId'])
            teamId = item['teamId']
            return item['teamId']

    
    return {
        "statusCode": 200,
        "body": teamId
    }   