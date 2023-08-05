import json
import boto3
import uuid
from decimal import Decimal
from boto3.dynamodb.conditions import Key
import time
import random

dynamodb = boto3.resource('dynamodb')
table_name_questions = 'trivia-questions'
table_name_games = 'trivia-games'
table_questions = dynamodb.Table(table_name_questions)
table_games = dynamodb.Table(table_name_games)
sns = boto3.client('sns')
sns_topic_arn = 'arn:aws:sns:us-east-1:512484164481:trivia-admin-topic'

class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            if o % 1 > 0:
                return float(o)
            else:
                return int(o)
        if isinstance(o, set):
            return list(o)
        return super(DecimalEncoder, self).default(o)

def lambda_handler(event, context):
    status_code = 200
    headers = {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Accept": '*/*',
        "Content-Type": 'application.json'
    }

    try:
        if event['routeKey'] == 'POST /games':
            request_data = json.loads(event['body'])
            categories = request_data.get('categories', [])
            difficulty_levels = request_data.get('difficultyLevels', [])
            num_questions = request_data['numQuestions']
            game_name = request_data['gameName']
            game_id = str(uuid.uuid4())

            response = table_questions.scan()
            if categories and difficulty_levels:
                matching_questions = [q for q in response['Items'] if q['Category'] in categories and q['DifficultyLevel'] in difficulty_levels]
            else:
                matching_questions = response['Items']

            if len(matching_questions) < num_questions:
                raise Exception("Not enough matching questions for this game.")

            selected_questions = random.sample(matching_questions, num_questions)

            table_games.put_item(
                Item={
                    'gameId': game_id,
                    'gameName': game_name,
                    'categories': categories,
                    'difficultyLevels': difficulty_levels,
                    'questions': selected_questions,
                    'timePlayed': 0,
                    'playerCount': 0,
                    'uniquePlayers': [],
                    'playSessions': 0,
                    'averageDuration': 0
                }
            )

            sns.publish(
                TopicArn=sns_topic_arn,
                Message=f"A new game with ID: {game_id} was created",
                Subject="Game Created Notification"
            )

            body = f"Created game with ID: {game_id}"
        elif event['routeKey'] == 'GET /games/{gameId}':
            game_id = event['pathParameters']['gameId']
            response = table_games.get_item(
                Key={
                    'gameId': game_id
                }
            )
            body = response.get('Item', None)
        elif event['routeKey'] == 'GET /games':
            response = table_games.scan()
            body = response.get('Items', [])
        elif event['routeKey'] == 'PATCH /games/{gameId}':
            game_id = event['pathParameters']['gameId']
            request_data = json.loads(event['body'])

            if 'playerIds' in request_data and 'playTime' in request_data:
                response = table_games.get_item(Key={'gameId': game_id})
                game_data = response['Item']
                new_players = [player_id for player_id in request_data['playerIds'] if player_id not in game_data['uniquePlayers']]
                added_player_count = len(new_players)

                game_data['playSessions'] += 1
                game_data['timePlayed'] += request_data['playTime']
                game_data['averageDuration'] = game_data['timePlayed'] / game_data['playSessions']

                update_expression = "SET uniquePlayers = list_append(uniquePlayers, :i), playerCount = playerCount + :pc, playSessions = :ps, timePlayed = :tp, averageDuration = :ad"
                expression_attribute_values={
                    ':i': new_players,
                    ':pc': added_player_count,
                    ':ps': game_data['playSessions'],
                    ':tp': game_data['timePlayed'],
                    ':ad': game_data['averageDuration']
                }

                if 'gameName' in request_data:
                    update_expression += ", gameName = :gn"
                    expression_attribute_values[':gn'] = request_data['gameName']

                table_games.update_item(
                    Key={'gameId': game_id},
                    UpdateExpression=update_expression,
                    ExpressionAttributeValues=expression_attribute_values
                )

                sns.publish(
                    TopicArn=sns_topic_arn,
                    Message=f"Game with ID: {game_id} was updated",
                    Subject="Game Updated Notification"
                )

                body = f"Updated game with ID: {game_id}"
        elif event['routeKey'] == 'DELETE /games/{gameId}':
            game_id = event['pathParameters']['gameId']
            table_games.delete_item(
                Key={
                    'gameId': game_id
                }
            )

            sns.publish(
                TopicArn=sns_topic_arn,
                Message=f"Game with ID: {game_id} was deleted",
                Subject="Game Deleted Notification"
            )

            body = f"Deleted game with ID: {game_id}"
        else:
            raise Exception(f"Unsupported route: {event['routeKey']}")
    except Exception as e:
        status_code = 400
        body = str(e)
    finally:
        body = json.dumps(body, cls=DecimalEncoder)

    return {
        'statusCode': status_code,
        'body': body,
        'headers': headers
    }