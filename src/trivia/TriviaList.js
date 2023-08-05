import React from 'react';
import { Box, Text, Button, Alert, AlertIcon, Grid, List, ListItem } from '@chakra-ui/react';
import axios from 'axios';

export default function TriviaList({ questions, onEdit }) {
  console.log("Received Questions: ", questions);

  const onDelete = (questionId) => {
    console.log("Deleting question with ID:", questionId);
    const isConfirmed = window.confirm('Are you sure you want to delete this question?');
    const url = `https://tunjietnw4.execute-api.us-east-1.amazonaws.com/questions/${questionId}`; // Adjust the URL as per your API.

    if (isConfirmed) {
      axios
        .delete(url)
        .then((response) => {
          console.log("Question deleted successfully!", response);
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error deleting question:", error);
        });
    }
  };

  return (
    <Box>
      {/* render questions if they exist */}
      {questions.length > 0 ? (
        <Grid templateColumns={{base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)"}} gap={6}>
          {questions.map((question) => (
            <Box key={question.id} p={5} shadow="md" borderWidth="1px">
              <Text fontSize="xl" mb={4}>
                Category: {question.Category}
              </Text>
              <Text mb={4}>Difficulty Level: {question.DifficultyLevel}</Text>
              <Text mb={4}>Content: {question.Content}</Text>
              <Text mb={4}>Points: {question.Points}</Text> {/* Displaying the points */}
              <Text mb={4}>Options:</Text>
              <List styleType="disc" mb={4}>
                {question.Options.map((option, index) => (
                  <ListItem key={index} color={index === question.AnswerIndex ? "green.500" : "black"}>
                    {option} {index === question.AnswerIndex && "(Answer)"}
                  </ListItem>
                ))}
              </List>
              <Button colorScheme="red" onClick={() => onDelete(question.id)}>
                Delete
              </Button>
              <Button colorScheme="blue" onClick={() => onEdit(question)}>
                Edit
              </Button>
            </Box>
          ))}
        </Grid>
      ) : (
        <Alert status="info">
          <AlertIcon />
          <Text>No questions found</Text>
        </Alert>
      )}
    </Box>
  );
}
