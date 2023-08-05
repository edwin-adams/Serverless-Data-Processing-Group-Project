import boto3

def lambda_handler(event, context):
    sns_client = boto3.client('sns')

    response = sns_client.list_subscriptions_by_topic(TopicArn='arn:aws:sns:us-east-1:342661425539:TriviaGame')

    subscribed_users = []
    for subscription in response['Subscriptions']:
        if 'SubscriptionArn' in subscription:
            if 'PendingConfirmation' not in subscription['SubscriptionArn']:
                endpoint = subscription['Endpoint']
                subscribed_users.append(endpoint)

    print(subscribed_users)
    
    return subscribed_users
