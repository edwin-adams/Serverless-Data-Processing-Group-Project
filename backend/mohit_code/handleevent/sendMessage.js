const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION,
});

async function sendMessage(data, connectionData,apigwManagementApi , required_team_id = null) {
  const postCalls = connectionData.Items.map(async ({ connectionId , team_id , game_id }) => {
    try {
      console.log("sending message to ", connectionId , team_id);
      if (required_team_id === null || required_team_id === team_id) {
        await apigwManagementApi
        .postToConnection({
          ConnectionId: connectionId,
          Data: JSON.stringify(data),
        })
        .promise();
      }
    } catch (e) {
      if (e.statusCode === 410) {
        console.log(`Found stale connection, deleting ${connectionId}`);
        await ddb
          .delete({ TableName: 'simplechat_connections', Key: { connectionId } })
          .promise();
      } else {
        throw e;
      }
    }
  });
  await Promise.all(postCalls);
}

module.exports = sendMessage;
