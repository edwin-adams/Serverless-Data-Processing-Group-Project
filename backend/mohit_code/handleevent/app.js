// Copyright 2018-2020Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB();

const saveIdentity = require("./saveIdentity");
const sendMessage = require("./sendMessage");
const getQuestion = require("./getQuestion");
const submitAnswer = require("./submitAnswer");

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION,
});

const { ConnectionsTableName } = process.env;

let apigwManagementApi;

exports.handler = async (event) => {
  let connectionData;
  apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint:
      event.requestContext.domainName + "/" + event.requestContext.stage,
  });

  try {
    connectionData = await ddb
      .scan({
        TableName: ConnectionsTableName
      })
      .promise();
    console.log('connectionData',JSON.stringify(connectionData));
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  const eventBody = JSON.parse(event.body);
  console.log("function called", JSON.stringify(event));
  switch (eventBody.action) {
    case "saveIdentity": {
      await saveIdentity(eventBody,event?.requestContext?.connectionId);
      break;
    }
    case "sendmessage": {
      const reqBody = {
        action: "getmessage",
        data: {
          value: eventBody.data.value,
          sender: eventBody.data.sender,
          team_id: eventBody.data.team_id,
        },
      };
      await sendMessage(reqBody, connectionData,apigwManagementApi, eventBody.data.team_id);
      break;
    }
    case "getQuestion": {
      const { game_id, currentTime } = eventBody.data;
      console.log(game_id,currentTime)
      const reqBody = await getQuestion(game_id, currentTime);
      await sendMessage(reqBody, connectionData,apigwManagementApi);
      break;
    }
    case "submitAnswer": {
      const { user_id, team_id, game_id, score, startTime } = eventBody.data;
      const scores = await submitAnswer(user_id, team_id, game_id, score, startTime);
      const reqBody = {
        action: "scoreSubmitted",
        data: {
          message: scores,
        },
      };
      await sendMessage(reqBody, connectionData,apigwManagementApi);
      break;
    }
  }

  try {
    await Promise.all(postCalls);
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  return { statusCode: 200, body: "Data sent." };
};







