import { BaseLayout } from '../layout/BaseLayout.tsx';
import { Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { CharacterGrid } from '../layout/CharacterGrid.tsx';
import { useEffect, useState } from 'react';
import { FaImage, FaQuestionCircle, FaQuoteRight } from 'react-icons/fa';
import { gotButtonStyle } from '../styles/buttonStyles.ts';
import { useApiClient } from '../hooks/useApiClient.ts';
import Select from 'react-select';

interface Character {
  name: string;
  gender: string;
  house: string;
  origin: string;
  status: string;
  religion: string;
  seasons: number[];
}

export const ClassicPage: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [incorrectGuesses, setIncorrectGuesses] = useState<string[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character[]>([]);
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [solutionCharacter, setSolutionCharacter] = useState<Character | null>(null);
  const [correctGuess, setCorrectGuess] = useState<string>('');
  const client = useApiClient();

  useEffect(() => {
    setIncorrectGuesses([]);
    setSelectedCharacter([]);
    setIncorrectGuesses([]);

    const fetchCharacters = async () => {
      try {
        const response = await client.getCharacters();
        if (response.status === 200) {
          const characterData = response.data.map((char: Character) => ({
            ...char,
            name: char.name || 'Unknown'
          }));
          setAllCharacters(characterData);
          const randomCharacter = characterData[Math.floor(Math.random() * characterData.length)];
          setSolutionCharacter(randomCharacter);
        }
      } catch (error) {
        console.error('Error fetching character data:', error);
      }
    };

    fetchCharacters();
  }, [client]);

  const handleCharacterSelect = (selectedOption: { value: string; label: string } | null) => {
    if (selectedOption) {
      const selectedChar = allCharacters.find(char => char.name === selectedOption.value);
      if (selectedChar) {
        setSelectedCharacter([selectedChar, ...selectedCharacter]);
        setAllCharacters(allCharacters.filter(char => char.name !== selectedOption.value));
      }
    }
  };

  const handleSubmit = () => {
    if (solutionCharacter && inputValue === solutionCharacter.name) {
      setCorrectGuess(inputValue);
    } else {
      setIncorrectGuesses([...incorrectGuesses, inputValue]);
    }
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
              <Button style={gotButtonStyle} width={'8em'} leftIcon={<FaQuestionCircle />}> Classic </Button>
              <Button style={gotButtonStyle} width={'8em'} leftIcon={<FaQuoteRight />}> Quote </Button>
              <Button style={gotButtonStyle} width={'8em'} leftIcon={<FaImage />}> Image </Button>
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
          </Box>
          <Box
            bgImage={'url(\'/bg_border.png\')'}
            bgSize="100% 100%"
            bgRepeat="no-repeat"
            bgPosition="top"
            p={4}
            borderRadius="md"
          >
            <HStack>
              <Input
                placeholder="Type character name ..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Button onClick={handleSubmit}> Submit </Button>
            </HStack>
          </Box>
          <Box
            bgImage={'url(\'/bg_border.png\')'}
            bgSize="100% 100%"
            bgRepeat="no-repeat"
            bgPosition="top"
            p={4}
            borderRadius="md"
          >
            <Select
              options={allCharacters.map(char => ({ value: char.name, label: char.name }))}
              onChange={handleCharacterSelect}
              placeholder="Select a character..."
            />
          </Box>
          <CharacterGrid characterData={selectedCharacter} />
        </VStack>
      </Box>
    </BaseLayout>
  );
};