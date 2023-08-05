import React from 'react';
import { Box, Text, Button, Alert, AlertIcon, Grid } from '@chakra-ui/react';
import axios from 'axios';

export default function GamesList({ games }) {
  console.log("Received Games: ", games);

  const onDelete = (gameId) => {
    console.log("Deleting game with ID:", gameId);
    const isConfirmed = window.confirm('Are you sure you want to delete this game?');
    const url = `https://tunjietnw4.execute-api.us-east-1.amazonaws.com/games/${gameId}`; // Adjust the URL as per your API.

    if (isConfirmed) {
      axios
        .delete(url)
        .then((response) => {
          console.log("Game deleted successfully!", response);
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error deleting game:", error);
        });
    }
  };

  return (
    <Box>
      {/* render games if they exist */}
      {games.length > 0 ? (
        <Grid templateColumns={{base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)"}} gap={6}>
          {games.map((game) => (
            <Box key={game.gameId} p={5} shadow="md" borderWidth="1px">
              <Text fontSize="xl" mb={4}>
                Game Name: {game.gameName}
              </Text>
              <Text mb={4}>Difficulty Level: {game.difficultyLevel}</Text>
              <Text mb={4}>Category: {game.category}</Text>
              <Text mb={4}>Number of Questions: {game.numberOfQuestions}</Text>

              <Button colorScheme="red" onClick={() => onDelete(game.gameId)}>
                Delete
              </Button>
            </Box>
          ))}
        </Grid>
      ) : (
        <Alert status="info">
          <AlertIcon />
          <Text>No games found</Text>
        </Alert>
      )}
    </Box>
  );
}
