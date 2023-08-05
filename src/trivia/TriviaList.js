import React from 'react';
import { Box, Text, Button, List, ListItem, Alert, AlertIcon, Grid } from '@chakra-ui/react';
import axios from 'axios';
import EditQuestionButton from './EditQuestionButton';

export default function TriviaList({ questions, onEdit }) {
  console.log("Received Questions: ", questions)
  
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
                Question: {question.Content}
              </Text>
              <Text mb={4}>Difficulty Level: {question.DifficultyLevel}</Text>
              <Text mb={4}>Category: {question.Category}</Text>
              <Text mb={4}>Points: {question.Points}</Text>

              <List spacing={3}>
                {question.Options.map((option, optionIndex) => (
                  <ListItem
                    key={optionIndex}
                    color={optionIndex === question.AnswerIndex ? 'green.500' : 'black'}
                  >
                    {option}
                    {optionIndex === question.AnswerIndex ? (
                      <Text as="span" color="green.500"> (Correct Answer)</Text>
                    ) : null}
                  </ListItem>
                ))}
              </List>
              <Button colorScheme="red" onClick={() => onDelete(question.id)}>
                Delete
              </Button>
              <EditQuestionButton onEdit={() => onEdit(question)} />
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
