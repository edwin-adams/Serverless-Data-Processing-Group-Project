const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB();

async function getQuestion(game_id, currentTime) {
  const params = {
    TableName: "gameQuestions",
    FilterExpression: "gameId = :game_id",
    ExpressionAttributeValues: {
      ":game_id": {
        S: game_id,
      },
    },
  };
  console.log(params);
  let data;
  try {
    data = await dynamodb.scan(params).promise();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
  const questionsObj = data.Items[0];
  const startTime = parseInt(questionsObj.startTime.S);
  console.log("current - start", currentTime - startTime);
  console.log(questionsObj, "tough" , currentTime - startTime , questionsObj.questions.L.length);
  if (currentTime - startTime > 25000 * +questionsObj.questions.L.length) {
    const reqBody = {
      action: "gameOver",
      data: {
        message: "Game Over",
      },
    };
    
    return reqBody;
  }

  if (currentTime - startTime < 0) {
    const reqBody = {
      action: "gameNotStarted",
      data: {
        message: "Game Not Started",
      },
    };
    return reqBody;
  }

  //fetch score from db
  const scoreParams = {
    TableName: "gameScores",
    FilterExpression: "game_id = :game_id",
    ExpressionAttributeValues: {
      ":game_id": {
        S: game_id,
      },
    },
  };
  let scoreData;
  try {
    scoreData = await dynamodb.scan(scoreParams).promise();
    
  } catch (err) {
    console.log(err);
  }
  const scoreObj = scoreData.Items;

  const questionNumber = Math.floor((currentTime - startTime) / 25000) + 1;
  const remainingTime = 25000 - ((currentTime - startTime) % 25000);
  const currentQuestion = questionsObj.questions.L[questionNumber - 1];
  const reqBody = {
    action: "currentQuestion",
    data: {
      question: processObject(currentQuestion),
      score: processObject(scoreObj).sort((a, b)=> a["score"] - b["score"]),
      questionNumber: questionNumber,
      remainingTime: remainingTime,
      startTime: startTime,
      game_id: game_id,
    },
  };
  return reqBody;
}

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

module.exports = getQuestion;
