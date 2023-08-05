const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB();

async function submitAnswer(user_id, team_id, game_id, score, startTime) {
    const params = {
      TableName: "gameScores",
      FilterExpression: "user_id = :user_id AND game_id = :game_id",
      ExpressionAttributeValues: {
        ":user_id": {
          S: user_id,
        },
        ":game_id": {
          S: game_id,
        },
      },
    };
    let scoreExists = false;
    let data;
    try {
  
      data = await dynamodb.scan(params).promise();
           console.log(data);
      if (data.Items.length > 0) {
        scoreExists = true;
      }
    } catch (err) {
      console.log(err);
    }
    if (scoreExists) {
      console.log('score exists');
      //update score
      const params = {
        TableName: "gameScores",
        Key: {
          id: {
            S: data.Items[0].id.S,
          },
        },
        UpdateExpression: "SET score = :score",
        ExpressionAttributeValues: {
          ":score": {
            N: (parseInt(data.Items[0].score.N) + parseInt(score)).toString(),
          },
        },
      };
      try {
        await dynamodb.updateItem(params).promise();
        return {
          statusCode: 200,
          body: JSON.stringify({
              message: "Score updated",
              user_id : user_id,
          }),
        }
      } catch (err) {
        console.log(err);
        return {
          statusCode: 500,
          body: JSON.stringify({
              message: "Error updating score",
              user_id : user_id,
          }),
        }
      }
    } else {
      console.log('score does not exist');
      //add score
      const params = {
        TableName: "gameScores",
        Item: {
          id: {
            S:
              Math.random().toString(36).substring(2, 15) +
              Math.random().toString(36).substring(2, 15),
          },
          user_id: {
            S: user_id,
          },
          game_id: {
            S: game_id,
          },
          team_id: {
            S: team_id,
          },
          score: {
            N: score.toString(),
          },
          startTime: {
            N: startTime.toString(),
          },
        },
      };
      try {
        await dynamodb.putItem(params).promise();
        return {
          statusCode: 200,
          body: JSON.stringify({
              message: "Score added",
              user_id : user_id,
          }),
        }
      } catch (err) {
        console.log(err);
        return {
          statusCode: 500,
          body: JSON.stringify({
              message: "Error adding score",
              user_id : user_id,
          }),
        }
      }
    }
  }

module.exports = submitAnswer;
