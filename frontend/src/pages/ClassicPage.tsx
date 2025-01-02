import { BaseLayout } from '../layout/BaseLayout.tsx';
import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react';
import { CharacterGrid } from '../layout/CharacterGrid.tsx';
import { useEffect, useState } from 'react';
import { FaImage, FaQuestionCircle, FaQuoteRight } from 'react-icons/fa';
import { gotButtonStyle } from '../styles/buttonStyles.ts';
import { useApiClient } from '../hooks/useApiClient.ts';
import { CharacterSelect } from '../components/CharacterSelect.tsx';
import { GroupBase } from 'react-select';
import { OptionBase } from 'chakra-react-select';
import { useNavigate } from 'react-router-dom';
import { CountdownTimer } from '../components/CountdownTimer.tsx';

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
  const navigate = useNavigate();

  const getCharacterOfTheDay = (characters: Character[]) => {
    const date = new Date().toISOString().split('T')[0];
    const hash = date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
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

  const handleNavigateToQuote = () => {
    navigate('/quote');
  };

  const handleNavigateToImage = () => {
    navigate('/image');
  };

  const handleNavigateToClassic = () => {
    navigate('/classic');
  };

  return (
    <BaseLayout>
      <Box
        bg="rgb(245, 221, 181)"
        minH="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        m={0}
        p={0}
        border="none"
      >
        <VStack>
          <Box
            bgImage={'url(\'/bg_border.png\')'}
            bgSize="100% 100%"
            bgRepeat="no-repeat"
            bgPosition="top"
            p={8}
            borderRadius="md"
            margin={4}
          >
            <HStack>
              <Button style={gotButtonStyle} width={'8em'} leftIcon={<FaQuestionCircle />}
                      onClick={handleNavigateToClassic}> Classic </Button>
              <Button style={gotButtonStyle} width={'8em'} leftIcon={<FaQuoteRight />}
                      onClick={handleNavigateToQuote}> Quote </Button>
              <Button style={gotButtonStyle} width={'8em'} leftIcon={<FaImage />}
                      onClick={handleNavigateToImage}> Image </Button>
            </HStack>
          </Box>
          <Box
            bgImage={'url(\'/bg_border.png\')'}
            bgSize="100% 100%"
            bgRepeat="no-repeat"
            bgPosition="top"
            p={4}
            borderRadius="md"
            margin={0}
            width={'30em'}
          >
            <Text textAlign={'center'}> Guess today's Game of Thrones character! </Text>
            <Text textAlign={'center'}> Type any character to begin. </Text>
            <Text textAlign={'center'}> DEBUG: The Solution is </Text>
            <Text textAlign={'center'}> {solutionCharacter?.name} </Text>
          </Box>
          <Box
            bgImage={'url(\'/bg_border.png\')'}
            bgSize="100% 100%"
            bgRepeat="no-repeat"
            bgPosition="top"
            p={4}
            borderRadius="md"
            minWidth={'30em'}
          >
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
          </Box>
          {correctGuess && (
            <Box
              bg={'rgba(32, 70, 48, 1)'}
              textColor={'white'}
              p={4}
              borderRadius="lg"
              border={'0.25em solid lightgreen'}

            >
              <VStack>
                <Text textAlign={'center'}>Correct! The character is {correctGuess}.</Text>
                <Text textAlign={'center'}>It took you {incorrectGuesses.length + 1} attempts to guess correctly.</Text>
                <Button style={gotButtonStyle} width={'8em'} onClick={handleNavigateToQuote}> Next </Button>
                <CountdownTimer />
              </VStack>
            </Box>
          )}
          <CharacterGrid characterData={selectedCharacter} solutionCharacter={solutionCharacter} />
        </VStack>
      </Box>
    </BaseLayout>
  );
};