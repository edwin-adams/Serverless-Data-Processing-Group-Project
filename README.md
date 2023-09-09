# Multi-Cloud Serverless Collaborative Trivia Challenge Game

This group project was developed as the final project for the CSCI 5410 - Serverless Data Processing Course. The scope of the project was to develop a multi-cloud serverless online trivia game that allows users to form teams, compete against other 
teams in real-time, and track their progress on global and category-specific leaderboards. The project comprised of 10 features, see project specification, of which I developed features seven and eight.

## Feature 7 - Trivia Content Management

• Add, edit, and delete trivia questions, including category and difficulty level
• Create and manage trivia games with custom settings (e.g., categories, difficulty levels, and time frames)
• Monitor and analyze gameplay data and user engagement

The CRUD operations of this feature were implemented using AWS DynamoDB, AWS Lambda Functions, AWS Simple Notification Service (SNS) and Google Looker Studio for Analytics. Admin user's are able to create new questions for trivia questions of any of our predetermined categories, or add new categories. Questions are available in three difficulties: easy, medium and hard and carry a points value of 10, 20 and 30 points respectively. Trivia Games are created by selecting an array of questions from the trivia questions table, as well as specific parameters for the game, such as time limit and number of questions, and then written to the trivia games DynamoDB table.

The gameplay analytics portion of this feature made use of a multi-cloud implementation between AWS and Google Cloud Platform (GCP):
- After the conslusion of each game, gameplay metrics such as total game duration, number of players and winning points tally are sent to the trivia-game DynamoDB table Via an HTTP PATCH request. Selected fields from the trivia-games table are extracted using the -5410-project-analytics lambda function. This function extracts the required data and pushes it to a google sheets store using the Google sheets API. AWS Eventbridge was used to automate the trigger for the lambda functions at four-hour intervals to update the statistics. On the GCP side of the implementation, the google sheets spreadsheet file is used as a data source for the Google Looker Studio Dashboard, where the data is visualized.

### Feature 8 - Notifications and Alerts

• Receive notifications for game invites, team updates, and new trivia game availability //This is not an 
additional task, it is also mentioned in other tasks. 
• Get alerts for achievements unlocked and leaderboard rank changes

This feature was implemented using AWS DynamoDB, AWS Lambda Functions and AWS SNS. Notifications for administrators and for players were divided into two separate SNS topics. Players were subscribed to the player SNS Topic at registration after their email address was collected. Once registered, the user's email is passed to the player SNS Topic and then persisted in a DynamoDB Table. The emails were stored because each user needs to be consent to the subscription in their email inbox before they can receive the notifications from the AWS platform, else each notification would trigger the initial authrozation prompt.

Similarly for administrators, emails were subscribed to the admin SNS topic Manually to receive notifications for actions such as trivia question and game additions, deletions and edits. Administrative emails were persisted in a separate DynamoDB table.

### Feature Architecture

![image](https://github.com/edwin-adams/Serverless-Data-Processing-Group-Project/assets/78889111/b17cee1a-5771-4960-9621-be71bdba40d6)

### Documentation

Please refer to the project documentation "Group 25 Trivia Game Documentation" for further details on how the entire project was implemented. The specifications for the project can be found in "Project_Specification_Version1.0.1-CSCI 5410"

## My Code Contributions
- [Backend Lambda Functions](https://github.com/edwin-adams/Serverless-Data-Processing-Group-Project/tree/master/backend/edwin_code)
- [Frontend - Trivia Questions](https://github.com/edwin-adams/Serverless-Data-Processing-Group-Project/tree/master/frontend/src/trivia)
- [Frontend - Trivia Games](https://github.com/edwin-adams/Serverless-Data-Processing-Group-Project/tree/master/frontend/src/trivia_games)

## References
- [Build a CRUD API with Lambda and Dynamo DB](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-dynamo-db.html)
- [Boto3 1.28.44 documentation - Dynamo DB](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html)
- [How To Put/Get Items From DynamoDB Table Using AWS Lambda (Boto3)](https://dev.classmethod.jp/articles/how-to-put-get-items-from-dynamodb-table-using-aws-lambda-boto3/)
- [CRUD OPERATIONS FOR AWS DynamoDB USING PYTHON BOTO3 SCRIPT](https://dheeraj3choudhary.com/crud-operations-for-aws-dynamodb-using-python-boto3-script)
