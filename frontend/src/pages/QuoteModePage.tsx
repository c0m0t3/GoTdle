import { BaseLayout } from '../layout/BaseLayout.tsx';
import { Box, Text, VStack } from '@chakra-ui/react';
import { useQuoteApi } from '../hooks/useQuoteApi.ts';
import { useEffect, useRef, useState } from 'react';
import { OptionBase } from 'chakra-react-select';
import { GroupBase } from 'react-select';
import { CharacterSelect } from '../components/CharacterSelect.tsx';
import { useApiClient } from '../hooks/useApiClient.ts';
import { CountdownTimer } from '../components/CountdownTimer.tsx';
import { PulsingButton } from '../components/PulsingButton.tsx';
import { BaseBox } from '../components/BaseBox.tsx';

interface CharacterOption extends OptionBase {
  label: string;
  value: string;
}

export const QuoteModePage = () => {
  const { fetchApi, apiData } = useQuoteApi();
  const [incorrectGuesses, setIncorrectGuesses] = useState<string[]>([]);
  const [correctGuesses, setCorrectGuesses] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterOption | null>(null);
  const [usedOptions, setUsedOptions] = useState<string[]>([]);
  const correctSectionRef = useRef<HTMLDivElement>(null);
  const client = useApiClient();

  useEffect(() => {
    setIsCorrect(false);
    setCorrectGuesses('');
    setSelectedCharacter(null);
    setIncorrectGuesses([]);
    setUsedOptions([]);
    fetchApi().catch((error) => {
      console.error('Failed to fetch quote:', error);
    });
  }, [fetchApi]);

  useEffect(() => {
    if (isCorrect && correctSectionRef.current) {
      correctSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isCorrect]);

  const handleCharacterSelect = (selected: CharacterOption | null) => {
    if (selected) {
      setSelectedCharacter(selected);
      const adjustedSelected = nameExceptions(selected);
      if (adjustedSelected.value.toLowerCase() === apiData?.character.name.toLowerCase()) {
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
      'Eddard Stark': 'Eddard "Ned" Stark',
      'Brandon Stark': 'Bran Stark',
      'Jeor Mormont': 'Joer Mormont',
      'Varys': 'Lord Varys'
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
          !usedOptions.includes(character.name)
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

          <BaseBox>
            <Text fontSize={'md'}>Which characters says</Text>
            <Text fontSize={'xl'} py={5}>"{apiData?.sentence}"</Text>
            <Text fontSize={'sm'}> Pssst...answer is...{apiData?.character.name}</Text>
          </BaseBox>
          <BaseBox>
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
          </BaseBox>

          <Box width={'30em'}>
            {isCorrect && (
              <Text textAlign={'center'} bg="green.500" color="white" p={2} m={1} rounded="md">
                {correctGuesses}
              </Text>
            )}
          </Box>
          <Box width={'30em'}>
            {incorrectGuesses.map((guess, index) => (
              <Text textAlign={'center'} key={index} bg="red.500" color="white" p={2} m={1} rounded="md">
                {guess}
              </Text>
            ))}
          </Box>

          {isCorrect && (
            <VStack ref={correctSectionRef}>
              <Text>When You Play The Game Of Thrones, You Win Or You Die.</Text>
              <Text>You guessed {correctGuesses}</Text>
              <Text>Number of tries: {incorrectGuesses.length + 1}</Text>
              <CountdownTimer />
              {/*TODO: 1. Get Attempts from classic modes. 2. Store somehow the attempt of quote to pass it to image*/}
              <Text mt={4}>Next mode: </Text>
              <PulsingButton label="Image" url="/image" />
            </VStack>
          )}

        </VStack>
      </Box>
    </BaseLayout>
  );
};