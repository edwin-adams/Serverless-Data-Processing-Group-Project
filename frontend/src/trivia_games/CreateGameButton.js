import React from 'react';
import { Button } from '@chakra-ui/react';

const CreateGameButton = ({ handleClickOpen }) => (
  <Button variant="solid" colorScheme="blue" onClick={handleClickOpen}>
    Create Game
  </Button>
);

export default CreateGameButton;
