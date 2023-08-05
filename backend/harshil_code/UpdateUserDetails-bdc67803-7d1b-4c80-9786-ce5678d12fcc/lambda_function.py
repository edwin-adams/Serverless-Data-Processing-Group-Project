import boto3
import json

userTableName = "users"

# Configure AWS credentials and region
dynamodb = boto3.resource("dynamodb")

def lambda_handler(event, context):
    body = event.get("body")  
    if not body:
        return {
            "statusCode": 400,
            "body": "Invalid request body",
        }

    try:
        user = json.loads(body) 
        result = update_user_details(user)
        if result:
            return {
                "statusCode": 200,
                "body": json.dumps({'user': user}),
                "headers": {
                    "Access-Control-Allow-Origin": "*"
                }
            }
        else:
            return {
                "statusCode": 500,
                "body": "Error updating data in DynamoDB",
                "headers": {
                    "Access-Control-Allow-Origin": "*"
                }
            }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": str(e),
            "headers": {
                "Access-Control-Allow-Origin": "*"
            }
        }


def update_user_details(user):
    print("Updating user details in DynamoDB:", user)

    update_expression = "SET #firstName = :firstNameValue, #lastName = :lastNameValue"

    expression_attribute_names = {
        "#firstName": "first_name",
        "#lastName": "last_name",
    }

    expression_attribute_values = {
        ":firstNameValue": user.get("first_name"),
        ":lastNameValue": user.get("last_name"),
    }

    table = dynamodb.Table(userTableName)

    try:
        response = table.update_item(
            Key={"firebase_user_id": user.get("firebase_user_id")},
            UpdateExpression=update_expression,
            ExpressionAttributeNames=expression_attribute_names,
            ExpressionAttributeValues=expression_attribute_values,
            ReturnValues="ALL_NEW",
        )
        updated_item = response.get("Attributes")
        print("Data successfully updated in DynamoDB:", updated_item)
        return updated_item
    except Exception as e:
        print("Error updating data in DynamoDB:", e)
        return None
