import React from 'react';
import { Button } from '@chakra-ui/react';

const CreateQuestionButton = ({ handleClickOpen }) => (
  <Button variant="solid" colorScheme="blue" onClick={handleClickOpen}>
    Create
  </Button>
);

export default CreateQuestionButton;
