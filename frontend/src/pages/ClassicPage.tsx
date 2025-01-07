import { BaseLayout } from '../layout/BaseLayout';
import { Button, HStack, Text, VStack } from '@chakra-ui/react';
import { CharacterGrid } from '../layout/CharacterGrid';
import { useEffect, useState } from 'react';
import { useApiClient } from '../hooks/useApiClient';
import { CharacterSelect } from '../components/CharacterSelect';
import { GroupBase } from 'react-select';
import { OptionBase } from 'chakra-react-select';
import murmurhash from 'murmurhash';
import { ModeNavigationBox } from '../components/ModeNavigationBox';
import { BaseBox } from '../components/BaseBox';
import { ModeSuccessBox } from '../components/ModeSuccessBox';
import { useLoadCharacterOptions } from '../utils/loadCharacterOptions';
import { gotButtonStyle } from '../styles/buttonStyles.ts';
import '../styles/ClassicPage.css';

interface Character {
  name: string;
  gender: string;
  house: string;
  origin: string;
  status: string;
  religion: string;
  seasons: number[];
  titles: string[];
}

interface CharacterOption extends OptionBase {
  label: string;
  value: string;
}

export const ClassicPage: React.FC = () => {
  const [incorrectGuesses, setIncorrectGuesses] = useState<string[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character[]>([]);
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [solutionCharacter, setSolutionCharacter] = useState<Character | null>(
    null,
  );
  const [correctGuess, setCorrectGuess] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const client = useApiClient();

  const getCharacterOfTheDay = (characters: Character[]) => {
    const date = new Date();
    const berlinTime = date.toLocaleString('en-US', {
      timeZone: 'Europe/Berlin',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
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
            name: char.name || 'Unknown',
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
      const selectedChar = allCharacters.find(
        (char) => char.name === selected.value,
      );
      if (selectedChar) {
        setSelectedCharacter([selectedChar, ...selectedCharacter]);
        setAllCharacters(
          allCharacters.filter((char) => char.name !== selected.value),
        );
      }
      if (solutionCharacter && selected.value === solutionCharacter.name) {
        setCorrectGuess(selected.value);
        const attempts = incorrectGuesses.length + 1;
        localStorage.setItem('classicModeAttempts', attempts.toString());
      } else {
        setIncorrectGuesses([...incorrectGuesses, selected.value]);
      }
    }
  };

  const loadCharacterOptions = useLoadCharacterOptions();

  return (
    <BaseLayout>
      <VStack spacing={4} className="classic-page">
        <ModeNavigationBox />
        <BaseBox className="classic-box">
          <Text textAlign="center">
            Guess today's Game of Thrones character!
          </Text>
          <Text textAlign="center">Type any character to begin.</Text>
          <Text textAlign="center">DEBUG: The Solution is</Text>
          <Text textAlign="center">{solutionCharacter?.name}</Text>
          <HStack justifyContent="center">
            <Button
              onClick={() => setIsOpen(true)}
              isDisabled={incorrectGuesses.length < 5}
              sx={gotButtonStyle}
            >
              Titles
            </Button>
          </HStack>
          {isOpen && (
            <VStack mt={4} alignItems="center">
              {solutionCharacter?.titles.map((title, index) => (
                <Text key={index}>{title}</Text>
              ))}
            </VStack>
          )}
        </BaseBox>
        <BaseBox textAlign="left" className="character-select-box">
          <CharacterSelect<CharacterOption, false, GroupBase<CharacterOption>>
            name="character"
            selectProps={{
              isMulti: false,
              placeholder: 'Type character name...',
              loadOptions: (
                inputValue: string,
                callback: (options: CharacterOption[]) => void,
              ) => {
                loadCharacterOptions(inputValue, incorrectGuesses).then(
                  callback,
                );
              },
              onChange: handleCharacterSelect,
              value: null,
              isDisabled: !!correctGuess,
              components: { DropdownIndicator: () => null },
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
        <CharacterGrid
          characterData={selectedCharacter}
          solutionCharacter={solutionCharacter}
        />
      </VStack>
    </BaseLayout>
  );
};
