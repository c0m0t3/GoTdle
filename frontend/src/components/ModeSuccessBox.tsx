import React from 'react';
import { Box, BoxProps, Text } from '@chakra-ui/react';
import { CountdownTimer } from './CountdownTimer';
import { PulsingButton } from './PulsingButton';
import Fireworks from './Fireworks';

interface ModeSuccessBoxProps extends BoxProps {
  correctGuess: string;
  attempts: number;
  label: string;
  url: string;
}

export const ModeSuccessBox: React.FC<ModeSuccessBoxProps> = ({
                                                                correctGuess,
                                                                attempts,
                                                                label,
                                                                url,
                                                                ...boxProps
                                                              }) => {
  return (
    <Box
      bg={'rgba(32, 70, 48, 1)'}
      textColor={'white'}
      textAlign={'center'}
      p={4}
      borderRadius="lg"
      border={'0.25em solid lightgreen'}
      width={'20em'}
      {...boxProps}
    >
      <Fireworks />
      <Text fontSize={'lg'} fontStyle={'italic'}>
        "When You Play The Game Of Thrones, You Win Or You Die."
      </Text>
      <Text textAlign={'right'} fontSize={'sm'} fontStyle={'italic'}>
        - Cersei Lannister
      </Text>
      <Text mt={4}>You guessed correct: </Text>
      <Text fontWeight={'bold'}>{correctGuess}</Text>
      <Text fontSize={'sm'}>
        Number of tries:
        <Text display={'inline'} fontWeight={'bold'}> {attempts}</Text>
      </Text>
      <Text mt={6}>Next mode: </Text>
      <PulsingButton label={label} url={url} mb={6} />
      <CountdownTimer />
    </Box>
  );
};