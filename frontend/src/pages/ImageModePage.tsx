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
  const [correctGuesses, setCorrectGuesses] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterOption | null>(null);
  const [usedOptions, setUsedOptions] = useState<string[]>([]);

  const client = useApiClient();

  useEffect(() => {
    setIsCorrect(false);
    setCorrectGuesses('');
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
      const adjustedSelected = nameExceptions(selected);
      if (adjustedSelected.value.toLowerCase() === apiData?.fullName.toLowerCase()) {
        setIsCorrect(true);
        setCorrectGuesses(selected.value);
      } else {
        setIncorrectGuesses([selected.value, ...incorrectGuesses]);
      }
      setUsedOptions((prev) => [...prev, selected.value]);
      setSelectedCharacter(null);
    }
  };

  /**
   * The character names from the external API do not exactly match those in our internal database.
   * Since the data in the database is correct, but we still want to use the external API,
   * we adjust the discrepancies using this method so that the validation of the selected options works correctly.
   * @param selected - The selected character option, which will be adjusted to match the names from the external API.
   * @returns The adjusted character option with the corrected name, if an exception is found; otherwise, the original option.
   */
  const nameExceptions = (selected: CharacterOption): CharacterOption => {
    const exceptions: { [key: string]: string } = {
      'Eddard Stark': 'Ned Stark',
      'Jaime Lannister': 'Jamie Lannister',
      'Robb Stark': 'Rob Stark',
      'Drogo': 'Khal Drogo',
      'Viserys Targaryen': 'Viserys Targaryn',
      'Daario Naharis': 'Daario',
      'Gendry': 'Gendry Baratheon',
      'Ramsay Bolton': 'Ramsey Bolton',
      'High Sparrow': 'The High Sparrow',
      'Tormund': 'Tormund Giantsbane',
      'Bronn': 'Lord Bronn'
    };
    const newValue = exceptions[selected.value];
    return newValue ? { ...selected, value: newValue } : selected;
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
                value: selectedCharacter,
                isDisabled: isCorrect,
                components: { DropdownIndicator: () => null }
              }}
            />
          </Box>

          <Box maxW="sm" width="100%">
            {isCorrect && (
              <Text mt={2} textAlign={'center'} bg="green.500" color="white" p={2} rounded="md">
                {correctGuesses}
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
            <VStack>
              <Text>Congratulations, you finished today's GoTdle!!</Text>
              <Text>Here are your Scores!</Text>
              <Text>Classic: ...</Text>
              <Text>Quote: ...</Text>
              <Text>Image: {incorrectGuesses.length + 1}</Text>
              <Text>Actual Streak: ...</Text>
              {/*TODO: 1. Get Attempts from other modes. 2. Store whole Score in database*/}
              <Button mt={4}>Jump to Scoreboard</Button>
            </VStack>
          )}

        </VStack>
      </Box>
    </BaseLayout>
  );
};