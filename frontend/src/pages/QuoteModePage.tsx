import { BaseLayout } from '../layout/BaseLayout.tsx';
import { Box, Text, VStack } from '@chakra-ui/react';
import { useQuoteApi } from '../hooks/useQuoteApi.ts';
import { useEffect, useState } from 'react';
import { OptionBase } from 'chakra-react-select';
import { GroupBase } from 'react-select';
import { CharacterSelect } from '../components/CharacterSelect.tsx';
import { useApiClient } from '../hooks/useApiClient.ts';
import { BaseBox } from '../components/BaseBox.tsx';
import { ModeNavigationBox } from '../components/ModeNavigationBox.tsx';
import { ModeSuccessBox } from '../components/ModeSuccessBox.tsx';

interface CharacterOption extends OptionBase {
  label: string;
  value: string;
}

export const QuoteModePage = () => {
  const { fetchApi, apiData } = useQuoteApi();
  const [incorrectGuesses, setIncorrectGuesses] = useState<string[]>([]);
  const [correctGuess, setCorrectGuess] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterOption | null>(null);
  const [usedOptions, setUsedOptions] = useState<string[]>([]);
  const client = useApiClient();

  useEffect(() => {
    setIsCorrect(false);
    setCorrectGuess('');
    setSelectedCharacter(null);
    setIncorrectGuesses([]);
    setUsedOptions([]);
    fetchApi().catch((error) => {
      console.error('Failed to fetch quote:', error);
    });
  }, [fetchApi]);

  const handleCharacterSelect = (selected: CharacterOption | null) => {
    if (selected) {
      setSelectedCharacter(selected);
      const adjustedSelected = nameExceptions(selected);
      if (adjustedSelected.value.toLowerCase() === apiData?.character.name.toLowerCase()) {
        setIsCorrect(true);
        setCorrectGuess(selected.value);
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

          <ModeNavigationBox />

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

          {isCorrect && (
            <ModeSuccessBox
              correctGuess={correctGuess}
              attempts={incorrectGuesses.length + 1}
              label="Image"
              url="/image"
            />
          )}

          <Box width={'30em'}>
            {isCorrect && (
              <Text textAlign={'center'} bg="green.500" color="white" p={2} m={1} rounded="md">
                {correctGuess}
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

        </VStack>
      </Box>
    </BaseLayout>
  );
};