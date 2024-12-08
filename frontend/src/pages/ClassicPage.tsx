import { BaseLayout } from '../layout/BaseLayout.tsx';
import { Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { CharacterGrid } from '../layout/CharacterGrid.tsx';
import { useState } from 'react';
import axios from 'axios';

export const ClassicPage: React.FC = () => {
  const sampleCharacterData = [
    ["Daenerys", "Female", "Targaryen", "Dragonstone", "Dead", "Faith of the Seven", "S01E01", "S08E06"],
    ["Jon Snow", "Male", "Stark", "Winterfell", "Alive", "Old Gods of the Forest", "S01E01", "S08E06"],
  ];

  const [characterData, setCharacterData] = useState<string[][]>(sampleCharacterData.reverse());
  const [inputValue, setInputValue] = useState<string>("");

  const fetchCharacterData = async (characterName: string) => {
    try {
      const response = await axios.get(`/api/character/${characterName}`);
      setCharacterData([response.data, ...characterData]);
    } catch (error) {
      console.error("Error fetching character data:", error);
    }
  };

  const handleSubmit = () => {
    fetchCharacterData(inputValue);
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
            bgImage={"url('/bg_border.png')"}
            bgSize="100% 100%"
            bgRepeat="no-repeat"
            bgPosition="top"
            p={8}
            borderRadius="md"
            margin={10}
          >
            <HStack>
              <Button> Classic </Button>
              <Button> Quote </Button>
              <Button> Image </Button>
            </HStack>
            <HStack>
              <Button> Streak </Button>
              <Button> Patchnotes </Button>
            </HStack>
          </Box>
          <Box
            bgImage={"url('/bg_border.png')"}
            bgSize="100% 100%"
            bgRepeat="no-repeat"
            bgPosition="top"
            p={4}
            borderRadius="md"
            margin={0}>
            <Text> Guess todays Game of Thrones character! </Text>
            <Text textAlign={"center"}> Type any character to begin. </Text>
          </Box>
          <Box
            bgImage={"url('/bg_border.png')"}
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
          <CharacterGrid characterData={characterData} />
        </VStack>
      </Box>
    </BaseLayout>
  );
};