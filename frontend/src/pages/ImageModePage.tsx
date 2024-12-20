import { BaseLayout } from '../layout/BaseLayout.tsx';
import { Box, Button, Image, Input, Text, VStack } from '@chakra-ui/react';
import { useImageApi } from '../hooks/useImageApi.ts';
import React, { useEffect, useState } from 'react';

export const ImageModePage = () => {
  const { fetchApi, apiData } = useImageApi();
  const [inputValue, setInputValue] = useState('');
  const [incorrectGuesses, setIncorrectGuesses] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    fetchApi().catch((error) => {
      console.error('Failed to fetch image:', error);
    });
  }, [fetchApi]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    if (inputValue.toLowerCase() === apiData?.fullName.toLowerCase()) {
      setIsCorrect(true);
    } else {
      setIncorrectGuesses([inputValue, ...incorrectGuesses]);
    }
    setInputValue('');
  };

  return (
    <BaseLayout>
      <Box p={4} display="flex" justifyContent="center" alignItems="center">
        <VStack>


          <Box
            position="relative"
            bg="rgba(0, 0, 0, 0.6)"
            color="white"
            p={5}
            border="2px solid rgba(255, 255, 255, 0.2)"
            backdropFilter="blur(8px)"
            rounded="md"
            shadow="lg"
            maxW="sm"
            textAlign="center"
          >
            <Text fontSize={'md'}>Which character is shown in this image?</Text>
            <Image src={apiData?.imageUrl} alt={apiData?.fullName} objectFit="contain" maxW="100%" maxH="100%" />
            <Text fontSize={'sm'}> Pssst...answer is...{apiData?.fullName}</Text>
            <Input
              mt={4}
              placeholder="Type character name..."
              value={inputValue}
              onChange={handleInputChange}
              isDisabled={isCorrect}
            />
            <Button mt={2} onClick={handleSubmit} isDisabled={isCorrect}>Submit</Button>


          </Box>
          <Box maxW="sm" width="100%">
            {isCorrect && (
              <Text mt={2} textAlign={'center'} bg="green.500" color="white" p={2} rounded="md">
                {apiData?.fullName}
              </Text>
            )}
          </Box>
          <Box maxW="sm" width="100%">
            {incorrectGuesses.map((guess, index) => (
              <Text textAlign={'center'} key={index} mt={2} bg="red.500" color="white" p={2} rounded="md">
                {guess}
              </Text>
            ))}
          </Box>
          {isCorrect && (
            <Button mt={4}>Next</Button>
          )}
        </VStack>
      </Box>
    </BaseLayout>
  );
};