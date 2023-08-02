import React from 'react';
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';



const TriviaTable: React.FC<any> = ({ items }) => {
   
  return (
    <div>
      <Heading size="md" mb={4}>
      </Heading>
      <Flex flexWrap="wrap">
        {items?.map((item:any,key:any):any => (
            <Box key={key} p={4} borderWidth="1px" borderRadius="md" m={2} minWidth="300px" width="100%">
              <Heading size="md" mb={2}>
                {item.game_name}
              </Heading>
              <Text mb={2}>{item.description}</Text>
              <Text  mb={2}>
                <b>Difficulty :</b> {item.difficulty_level}
              </Text>
              <Text mb={2}>
                <b>Time Frame :</b> {item.time_frame}
              </Text>
              <Text mt={2}>
                <b>Category :</b> {item.category}</Text>
              <Text mt={2}>
                <b>Participants :</b> {item.participants}</Text>
              <Text mt={2}>
                <b>Game ID :</b> {item.game_id}
              </Text>
              <Button mt={4} colorScheme="blue">
              Join
            </Button >
            </Box>
          ))}
      </Flex>
    </div>
  );
};

export default TriviaTable;
