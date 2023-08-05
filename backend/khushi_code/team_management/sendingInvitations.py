import json
import boto3

sqs = boto3.client('sqs')
sns = boto3.client('sns')

def lambda_handler(event, context):
    
    subscribers = event['email']
    print(subscribers)
    
    attributes = {
        'email': [subscribers]
    }
    
    snsArn = 'arn:aws:sns:us-east-1:342661425539:TriviaGame'
    queueUrl = 'https://sqs.us-east-1.amazonaws.com/342661425539/TriviaGame'
    
    response = sendSubscriptions = sns.subscribe(
        TopicArn=snsArn,
        Protocol='email',
        Endpoint=subscribers,
        Attributes={
            'FilterPolicy': json.dumps(attributes)
            }
        )
    
    http_status_code = response['ResponseMetadata']['HTTPStatusCode']
    print(http_status_code)
    
    if http_status_code == 200:
        return {
            'statusCode': 200,
            'body': json.dumps('Subscription send!!')
        }
    
    else: 
        return {
            'statusCode': 400,
            'body': json.dumps('Subscription not send!!')
        }

