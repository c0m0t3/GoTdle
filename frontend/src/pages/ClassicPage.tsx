import { BaseLayout } from '../layout/BaseLayout.tsx';
import { Text, VStack } from '@chakra-ui/react';
import { CharacterGrid } from '../layout/CharacterGrid.tsx';
import { useEffect, useState } from 'react';
import { useApiClient } from '../hooks/useApiClient.ts';
import { CharacterSelect } from '../components/CharacterSelect.tsx';
import { GroupBase } from 'react-select';
import { OptionBase } from 'chakra-react-select';
import murmurhash from 'murmurhash';
import { ModeNavigationBox } from '../components/ModeNavigationBox.tsx';
import { BaseBox } from '../components/BaseBox.tsx';
import { ModeSuccessBox } from '../components/ModeSuccessBox.tsx';

interface Character {
  name: string;
  gender: string;
  house: string;
  origin: string;
  status: string;
  religion: string;
  seasons: number[];
}

interface CharacterOption extends OptionBase {
  label: string;
  value: string;
}

export const ClassicPage: React.FC = () => {
  const [incorrectGuesses, setIncorrectGuesses] = useState<string[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character[]>([]);
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [solutionCharacter, setSolutionCharacter] = useState<Character | null>(null);
  const [correctGuess, setCorrectGuess] = useState<string>('');
  const [usedOptions, setUsedOptions] = useState<string[]>([]);
  const client = useApiClient();

  const getCharacterOfTheDay = (characters: Character[]) => {
    const date = new Date();
    const berlinTime = date.toLocaleString('en-US', {
      timeZone: 'Europe/Berlin',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const hash = murmurhash.v3(berlinTime);
    const index = hash % characters.length;
    return characters[index];
  };

  useEffect(() => {
    setIncorrectGuesses([]);
    setSelectedCharacter([]);

    const fetchCharacters = async () => {
      try {
        const response = await client.getCharacters();
        if (response.status === 200) {
          const characterData = response.data.map((char: Character) => ({
            ...char,
            name: char.name || 'Unknown'
          }));
          setAllCharacters(characterData);

          const todayCharacter = getCharacterOfTheDay(characterData);
          setSolutionCharacter(todayCharacter);
        }
      } catch (error) {
        console.error('Error fetching character data:', error);
      }
    };

    fetchCharacters();
  }, [client]);

  const handleCharacterSelect = (selected: CharacterOption | null) => {
    if (selected) {
      const selectedChar = allCharacters.find(char => char.name === selected.value);
      if (selectedChar) {
        setSelectedCharacter([selectedChar, ...selectedCharacter]);
        setAllCharacters(allCharacters.filter(char => char.name !== selected.value));
      }
      if (solutionCharacter && selected.value === solutionCharacter.name) {
        setCorrectGuess(selected.value);
        const attempts = incorrectGuesses.length + 1;
        localStorage.setItem('classicModeAttempts', attempts.toString());
      } else {
        setIncorrectGuesses([...incorrectGuesses, selected.value]);
      }
      setUsedOptions((prev) => [...prev, selected.value]);
    }
  };
  const loadCharacterOptions = async (inputValue: string) => {
    const characters = await client.getCharacters();
    if (characters.status === 200) {
      return characters.data
        .filter(
          (character) =>
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
      <VStack>
        <ModeNavigationBox />
        <BaseBox>
          <Text textAlign={'center'}> Guess today's Game of Thrones character! </Text>
          <Text textAlign={'center'}> Type any character to begin. </Text>
          <Text textAlign={'center'}> DEBUG: The Solution is </Text>
          <Text textAlign={'center'}> {solutionCharacter?.name} </Text>
        </BaseBox>
        <BaseBox>
          <CharacterSelect<CharacterOption, false, GroupBase<CharacterOption>>
            name="character"
            selectProps={{
              isMulti: false,
              placeholder: 'Type character name...',
              loadOptions: loadCharacterOptions,
              onChange: handleCharacterSelect,
              value: null,
              isDisabled: !!correctGuess,
              components: { DropdownIndicator: () => null }
            }}
          />
        </BaseBox>
        {correctGuess && (
          <ModeSuccessBox
            correctGuess={correctGuess}
            attempts={incorrectGuesses.length + 1}
            label="Quote"
            url="/quote"
          />
        )}
        <CharacterGrid characterData={selectedCharacter} solutionCharacter={solutionCharacter} />
      </VStack>
    </BaseLayout>
  );
};