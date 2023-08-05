import React from 'react';
import { Box, Input, Center } from '@chakra-ui/react';

export default function GamesSearch({ onSearch }) {
  return (
    <Box>
      <Center>
        <Input 
          type="text" 
          placeholder="Search games by name or category..." 
          onChange={(event) => onSearch(event.target.value)}
        />
      </Center>
    </Box>
  );
};
