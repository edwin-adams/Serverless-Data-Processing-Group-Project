import boto3

def lambda_handler(event, context):
    # Replace 'your-dynamodb-table-name' with the actual name of your DynamoDB table
    table_name = 'users'

    # Create a DynamoDB resource using boto3
    dynamodb = boto3.resource('dynamodb')

    # Get the DynamoDB table
    table = dynamodb.Table(table_name)

    # Define the attributes you want to retrieve
    attributes_to_get = ['first_name', 'last_name', 'email']

    # Use the scan operation with ProjectionExpression to retrieve specific fields
    response = table.scan(ProjectionExpression=', '.join(attributes_to_get))

    # Extract the 'Items' from the response, which contains the actual data
    items = response['Items']

    # Continue scanning if the result is paginated
    while 'LastEvaluatedKey' in response:
        response = table.scan(
            ProjectionExpression=', '.join(attributes_to_get),
            ExclusiveStartKey=response['LastEvaluatedKey']
        )
        items.extend(response['Items'])

    # Now 'items' contains only the specified attributes from the DynamoDB table
    # You can process this data as needed

    return {
        'statusCode': 200,
        'body': items,
                "headers": {
                    "Access-Control-Allow-Origin": "*"
                }
    }
