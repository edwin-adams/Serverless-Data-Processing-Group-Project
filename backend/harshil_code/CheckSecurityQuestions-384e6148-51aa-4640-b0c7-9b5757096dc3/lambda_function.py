import boto3
import json

def check_security_question_dynamo(user_id, a1, a2, a3):
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table_name = 'users'
    table = dynamodb.Table(table_name)

    response = table.get_item(
        Key={'firebase_user_id': user_id},
        ProjectionExpression='firebase_user_id, first_name, last_name, answer1, answer2, answer3, email, image'
    )
    data = response.get('Item')

    print(data)
    print(data['answer1'], a1, data['answer2'], a2, data['answer3'], a3)
    if data and data['answer1'] == a1 and data['answer2'] == a2 and data['answer3'] == a3:
        return True, {'user_id': data['firebase_user_id'], 'first_name': data['first_name'], 'last_name': data['last_name'], 'email': data['email'], 'image': data['image']}
    return False, None


def lambda_handler(event, context):
    # Assuming the event contains the required data for user_id, a1, a2, and a3.
    print(event)
    event = json.loads(event['body'])
    user_id = event['user_id']
    a1 = event['a1']
    a2 = event['a2']
    a3 = event['a3']

    # Call the check_security_question_dynamo function with the provided event data.
    userFound, result = check_security_question_dynamo(user_id, a1, a2, a3)

    if(userFound):
        return {
            "statusCode": 200,
            "headers": {
                    "Access-Control-Allow-Origin": "*",
            },
            "body": json.dumps({"user_info": result}),
        }
    else:
        return {
            "statusCode": 404,
            "headers": {
                    "Access-Control-Allow-Origin": "*",
            },
            "body": json.dumps({"user_info": 'User Not Found'}),
        }