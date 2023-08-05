const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const { ConnectionsTableName } = process.env;

async function saveIdentity(eventBody,connectionId) {
  const reqBody = eventBody.data;
  const userInfo = reqBody.currentUser;
  const teamId = reqBody.teamId;
  const gameId = reqBody.gameId;
  const params = {
    TableName: ConnectionsTableName,
    Item: {
      connectionId: connectionId,
      team_id : teamId,
      game_id : gameId,
      ...userInfo,
    },
  };
  try {
    await dynamodb.put(params).promise();
  } catch (err) {
    console.log(err);
  }
}

module.exports = saveIdentity;
