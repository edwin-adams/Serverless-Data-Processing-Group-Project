import React from 'react';
import { Box, Input, Center } from '@chakra-ui/react';

export default function ServiceSearch({ onSearch }) {
  return (
    <Box>
      <Center>
        <Input 
          type="text" 
          placeholder="Search services..." 
          onChange={(event) => onSearch(event.target.value)}
        />
      </Center>
    </Box>
  );
};