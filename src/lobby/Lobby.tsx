// MyComponent.tsx

import React, { useEffect, useState } from "react";
import { Box, Card, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import { getRemainingTimeInSeconds } from "../utils/functions";

const MyComponent: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState<any>(0);

  const fetchData = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    axios
      .post(
        "https://5manmfyif3pgnkqygshrx2xurm0ndzkl.lambda-url.us-east-1.on.aws/",
        { game_id: user.game_id }
      )
      .then(({ data }) => {
        const { response } = data;
        setUsers(response.list_of_user);
        const time_left = getRemainingTimeInSeconds(response.time_to_start);
        setSecondsLeft(time_left);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (secondsLeft > 0) {
      // if(secondsLeft ==)
      setTimeout(() => {
        setSecondsLeft((current) => current - 1);
      }, 1000);
    }
  }, [secondsLeft]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box p="2">
      <div>
        <Flex justifyContent="center" alignItems="center">
          <Card maxW="sm" padding="5">
            <Text fontSize="2xl">Time Left: {secondsLeft}</Text>
          </Card>
        </Flex>
        <Text fontSize="xl">User Names</Text>
        <Flex>
          {users.map((data, index) => (
            <CustomCard data={{ id: data }} key={index} />
          ))}
        </Flex>
      </div>
    </Box>
  );
};

const CustomCard = ({ data }) => {
  return (
    <Card padding="5" maxW="sm" margin="3">
      <Text fontSize="lg">{data.id}</Text>
      {/* <Text fontSize="lg">{data.name}</Text> */}
      <Text fontSize="lg">Test Name</Text>
    </Card>
  );
};

export default MyComponent;
