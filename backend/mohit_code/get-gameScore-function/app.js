const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB();
exports.lambdaHandler = async (event, context) => {
  //get query string params
  let gameId, teamId, userId;
  if (event.queryStringParameters) {
    gameId = event.queryStringParameters?.gameId;
    teamId = event.queryStringParameters?.teamId;
    userId = event.queryStringParameters?.userId;
  }

  //get score from db
  if (gameId) {
    const params = {
      TableName: "gameScores",
      FilterExpression: "game_id = :game_id",
      ExpressionAttributeValues: {
        ":game_id": {
          S: gameId,
        },
      },
    };
    let data;
    try {
      data = await dynamodb.scan(params).promise();
    } catch (err) {
      console.log(err);
    }
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addData(processObject(data.Items))),
    };
  }

  if (teamId) {
    const params = {
      TableName: "gameScores",
      FilterExpression: "team_id = :team_id",
      ExpressionAttributeValues: {
        ":team_id": {
          S: teamId,
        },
      },
    };
    let data;
    try {
      data = await dynamodb.scan(params).promise();
    } catch (err) {
      console.log(err);
    }
    return {
      statusCode: 200,
      body: JSON.stringify(addData(processObject(data.Items))),
    };
  }

  if (userId) {
    const params = {
      TableName: "gameScores",
      FilterExpression: "user_id = :user_id",
      ExpressionAttributeValues: {
        ":user_id": {
          S: userId,
        },
      },
    };
    let data;
    try {
      data = await dynamodb.scan(params).promise();
    } catch (err) {
      console.log(err);
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addData(processObject(data.Items))),
    };
  }

  //get all scores from db
  const params = {
    TableName: "gameScores",
  };

  let data;
  try {
    data = await dynamodb.scan(params).promise();
  } catch (err) {
    console.log(err);
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(addData(processObject(data.Items))),
  };
};

function processObject(obj) {
  if (obj === null) {
    return null;
  } else if (typeof obj === "object" && !Array.isArray(obj)) {
    if (obj.hasOwnProperty("S")) {
      return obj["S"];
    } else if (obj.hasOwnProperty("N")) {
      return Number(obj["N"]);
    } else if (obj.hasOwnProperty("L")) {
      return obj["L"].map(processObject);
    } else if (obj.hasOwnProperty("M")) {
      const processedObj = {};
      for (const key in obj["M"]) {
        processedObj[key] = processObject(obj["M"][key]);
      }
      return processedObj;
    } else {
      // Handle other object types that might be encountered
      const processedObj = {};
      for (const key in obj) {
        processedObj[key] = processObject(obj[key]);
      }
      return processedObj;
    }
  } else if (Array.isArray(obj)) {
    return obj.map(processObject);
  } else {
    return obj;
  }
}

function addData(obj) {
  return obj.map((item) => {
    //randomly generate statues win or loss
    const status = Math.random() > 0.5 ? "win" : "loss";
    return {
      ...item,
      status: status,
    };
  });
}
