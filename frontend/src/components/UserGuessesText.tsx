import { Text, TextProps } from '@chakra-ui/react';
import React from 'react';

export const UserGuessesText: React.FC<TextProps> = (props) => {
  return (
    <Text
      textAlign={'center'}
      color="white"
      p={2}
      m={1}
      rounded="md"
      {...props}
    />
  );
};
