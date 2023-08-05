import json
import boto3
import uuid
import json
import requests 

def set_google_application_credentials(file_path):
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = file_path


def lambda_handler(event, context):
    # TODO implement
    list_of_tag = ""
    try:
        print("evebnt body " + str(event))
        question = json.loads(event["body"])["question"]
        # get response for tagging question lambda

        list_of_tag = ['Law & Government', 'Government', 'Executive Branch', 'News', 'Politics', 'Other', 'Reference',
                       'Humanities', 'History']
        payload = {
            "question" : question
        }
        
        response = requests.post(set_question, json=payload)
        print(json.loads(response.text)["response"])
        
        list_of_tag = json.loads(response.text)["response"][:5]

        
        
        # table = dynamodb.Table(table_name)
        table.put_item(
            Item={
                'question': question,
                'list_of_tag': list_of_tag
            }
        )
        print("stored the answers ")
        status = True

        print("list answer : " + str(list_of_tag))
    except Exception as e:

        print("Error : " + str(e))
        status = False

    return {
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': "GET,POST, PUT, DELETE",
            "Access-Control-Allow-Headers": "Content-Type",
            'Content-Type': 'application/json'
        },
        'statusCode': 200,
        'body': list_of_tag,
        "status": status
    }
