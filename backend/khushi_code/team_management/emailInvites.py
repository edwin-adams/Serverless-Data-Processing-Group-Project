import json
import boto3
import uuid
import urllib.parse

dynamodb = boto3.resource('dynamodb')
table_name = 'trivia_team'
table = dynamodb.Table(table_name)

sqs = boto3.client('sqs')
sns = boto3.client('sns')

def lambda_handler(event, context):
    
    teamName = event['teamName']
    senderName = event['fromName']
    senderEmail = event['fromEmail']
    subscribers = event['email']
    
    inviteIdOwner = str(uuid.uuid4())
    
    teamId = str(uuid.uuid4())
    
    # adding team owner here
    item_owner = {
        'inviteId': inviteIdOwner,
        'email': senderEmail,
        'status': True,
        'teamName': teamName,
        'teamCreater': True,
        'declined': False,
        'teamId': teamId,
        'isAdmin': False
    }
    table.put_item(Item=item_owner)
    
    snsArn = 'arn:aws:sns:us-east-1:342661425539:TriviaGame'
    queueUrl = 'https://sqs.us-east-1.amazonaws.com/342661425539/TriviaGame'

    subject = 'Invitation'
    for subscribee in subscribers:
        inviteId = str(uuid.uuid4())
        message_attributes = {
            'email': {
                'DataType': 'String',
                'StringValue': subscribee
            }
        }
        item = {
            'inviteId': inviteId,
            'email': subscribee,
            'status': False,
            'teamName': teamName,
            'teamCreater': False,
            'declined': False,
            'teamId': teamId,
            'isAdmin': False

        }
        response = table.put_item(Item=item)
        encodedTeamName = urllib.parse.quote(teamName)
        encodedSenderName = urllib.parse.quote(senderName)
        
        invitationLink = f"http://localhost:3000/acceptInvite/{encodedTeamName}/{encodedSenderName}/{subscribee}/{inviteId}"
        newLine = "\n"

        message = f"Hello!! This is your invitation to Team {teamName}.\n\n" \
                  f"This invitation has been send by :{senderName}\n\n" \
                  f"Click on the link below to accept the invitation:\n{invitationLink}"
                  
        message = sendEmails(snsArn, message, subject, message_attributes)
        print(message)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }


def sendEmails(topic_arn, message, subject, message_attributes):
    sns = boto3.client('sns')

    response = sns.publish(
        TopicArn=topic_arn,
        Message=message,
        Subject=subject,
        MessageAttributes=message_attributes
    )
    print(response)

    return response['MessageId']