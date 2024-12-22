import { BaseLayout } from '../layout/BaseLayout.tsx';
import { Box, Button, Image, Text, VStack } from '@chakra-ui/react';
import { useImageApi } from '../hooks/useImageApi.ts';
import { useEffect, useState } from 'react';
import { CharacterSelect } from '../components/CharacterSelect.tsx';
import { useApiClient } from '../hooks/useApiClient.ts';
import { GroupBase } from 'react-select';
import { OptionBase } from 'chakra-react-select';

interface CharacterOption extends OptionBase {
  label: string;
  value: string;
}

export const ImageModePage = () => {
  const { fetchApi, apiData } = useImageApi();
  const [incorrectGuesses, setIncorrectGuesses] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterOption | null>(null);
  const [usedOptions, setUsedOptions] = useState<string[]>([]);

  const client = useApiClient();

  useEffect(() => {
    setIsCorrect(false);
    setSelectedCharacter(null);
    setIncorrectGuesses([]);
    setUsedOptions([]);
    fetchApi().catch((error) => {
      console.error('Failed to fetch image:', error);
    });
  }, [fetchApi]);


  const handleCharacterSelect = (selected: CharacterOption | null) => {
    if (selected) {
      setSelectedCharacter(selected);
      if (selected.value.toLowerCase() === apiData?.fullName.toLowerCase()) {
        setIsCorrect(true);
      } else {
        setIncorrectGuesses([selected.value, ...incorrectGuesses]);
      }
      setUsedOptions((prev) => [...prev, selected.value]);
      setSelectedCharacter(null);
    }
  };

  const loadCharacterOptions = async (inputValue: string) => {
    const characters = await client.getCharacters();
    if (characters.status === 200) {
      return characters.data
        .filter((character) =>
          character?.name?.toLowerCase().startsWith(inputValue.toLowerCase()) &&
          !usedOptions.includes(character.name) // Filtere verwendete Optionen aus
        )
        .map((character) => ({
          label: character.name ?? '',
          value: character.name ?? ''
        }));
    }
    return [];
  };

  return (
    <BaseLayout>
      <Box p={4} display="flex" justifyContent="center" alignItems="center">
        <VStack>

          <Box
            position="relative"
            bg="rgba(0, 0, 0, 0.6)"
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

            <CharacterSelect<CharacterOption, false, GroupBase<CharacterOption>>
              name="character"
              selectProps={{
                isMulti: false,
                placeholder: 'Type character name...',
                loadOptions: loadCharacterOptions,
                onChange: handleCharacterSelect,
                value: selectedCharacter
              }}
            />
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