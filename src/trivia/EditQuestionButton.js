import React from 'react';
import { Button } from '@chakra-ui/react';

const EditQuestionButton = ({ onEdit, questionId }) => (
  <Button variant="solid" colorScheme="teal" onClick= {onEdit}>
    Edit
  </Button>
);

export default EditQuestionButton;
