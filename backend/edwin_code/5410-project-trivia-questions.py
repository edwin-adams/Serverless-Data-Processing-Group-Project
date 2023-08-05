import json
import boto3
import uuid

client = boto3.client('dynamodb')
sns_client = boto3.client('sns')
table_name = 'trivia-questions'
sns_topic_arn = 'arn:aws:sns:us-east-1:512484164481:trivia-admin-topic'

def lambda_handler(event, context):
    body = None
    status_code = 200
    headers = {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "https://localhost:3000",
        "Access-Control-Allow-Methods": "*",
        "Accept": '*/*',
        "Content-Type": 'application.json'
    }

    try:
        if event['routeKey'] == 'DELETE /questions/{id}':
            question_id = event['pathParameters']['id']
            client.delete_item(
                TableName=table_name,
                Key={
                    'id': {'S': question_id}
                }
            )
            body = f"Deleted question {question_id}"
            sns_client.publish(
                TopicArn=sns_topic_arn,
                Message=f'Deleted question with ID: {question_id}',
                Subject='Question Deleted'
            )
        elif event['routeKey'] == 'GET /questions/{id}':
            question_id = event['pathParameters']['id']
            response = client.get_item(
                TableName=table_name,
                Key={
                    'id': {'S': question_id}
                }
            )
            body = response.get('Item', None)
        elif event['routeKey'] == 'GET /questions':
            response = client.scan(TableName=table_name)
            body = response.get('Items', None)
        elif event['routeKey'] == 'POST /questions':
            request_data = json.loads(event['body'])
            new_ids = []
            for data in request_data:
                new_question_id = str(uuid.uuid4())
                client.put_item(
                    TableName=table_name,
                    Item={
                        'id': {'S': new_question_id},
                        'Category': {'S': data['Category']},
                        'DifficultyLevel': {'S': data['DifficultyLevel']},
                        'Content': {'S': data['Content']},
                        'Options': {'SS': data['Options']},  # Options should be a list of strings
                        'AnswerIndex': {'N': str(data['AnswerIndex'])},  # AnswerIndex should be an integer (0-3)
                        'Hint': {'S': data['Hint']},
                        'Points': {'N': str(data['Points'])}
                    }
                )
                new_ids.append(new_question_id)
                sns_client.publish(
                    TopicArn=sns_topic_arn,
                    Message=f'Created new question with ID: {new_question_id}',
                    Subject='New Question Created'
                )
            body = f"Created questions with IDs: {new_ids}"
        elif event['routeKey'] == 'PUT /questions/{id}':
            question_id = event['pathParameters']['id']
            request_data = json.loads(event['body'])
            client.put_item(
                TableName=table_name,
                Item={
                    'id': {'S': question_id},
                    'Category': {'S': request_data['Category']},
                    'DifficultyLevel': {'S': request_data['DifficultyLevel']},
                    'Content': {'S': request_data['Content']},
                    'Options': {'SS': request_data['Options']},  # Options should be a list of strings
                    'AnswerIndex': {'N': str(request_data['AnswerIndex'])},  # AnswerIndex should be an integer (0-3)
                    'Hint': {'S': request_data['Hint']},
                    'Points': {'N': str(request_data['Points'])}
                }
            )
            body = f"Updated question {question_id}"
            sns_client.publish(
                TopicArn=sns_topic_arn,
                Message=f'Updated question with ID: {question_id}',
                Subject='Question Updated'
            )
        else:
            raise Exception(f"Unsupported route: {event['routeKey']}")
    except Exception as e:
        status_code = 400
        body = str(e)
    finally:
        body = json.dumps(body)

    return {
        'statusCode': status_code,
        'body': body,
        'headers': headers
    }