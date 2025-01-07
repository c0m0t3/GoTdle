import { Box, BoxProps } from '@chakra-ui/react';
import React from 'react';

export const BaseBox: React.FC<BoxProps> = (props) => {
  return (
    <Box
      bgImage={"url('/bg_border.png')"}
      bgSize="100% 100%"
      bgRepeat="no-repeat"
      bgPosition="top"
      borderRadius="md"
      p={4}
      width={'30em'}
      textAlign={'center'}
      {...props}
    />
  );
};
