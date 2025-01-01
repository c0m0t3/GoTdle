import { Box, Grid, GridItem, Text } from '@chakra-ui/react';

interface Character {
  name: string;
  gender: string;
  house: string;
  origin: string;
  status: string;
  religion: string;
  seasons: number[];
}

interface CharacterGridProps {
  characterData: Character[];
}

export const CharacterGrid: React.FC<CharacterGridProps> = ({ characterData }) => {
  const initialColumns = ['Character', 'Gender', 'House', 'Origin', 'Status', 'Religion', 'First Appearance', 'Last Appearance'];

  const transformCharacterData = (data: Character[]): string[][] => {
    return data.map((character: Character) => [
      character.name,
      character.gender,
      character.house,
      character.origin,
      character.status,
      character.religion,
      character.seasons[0] ? `S${character.seasons[0]}E01` : '',
      character.seasons[character.seasons.length - 1] ? `S${character.seasons[character.seasons.length - 1]}E10` : ''
    ]);
  };

  const characters = [initialColumns, ...transformCharacterData(characterData)];

  const getColor = (value: string, column: string) => {
    if (column === 'Status') {
      return value === 'alive' ? 'green.200' : 'red.200';
    }
    return 'yellow.200';
  };

  const getArrow = (value: string, column: string) => {
    if (column === 'First Appearance' || column === 'Last Appearance') {
      return value.includes('E01') ? '↑' : '↓';
    }
    return '';
  };

  return (
    <Box
      bgImage={'url(\'/bg_border.png\')'}
      bgSize="100% 100%"
      bgRepeat="no-repeat"
      bgPosition="top"
      p={4}
      px={'4em'}
    >
      <Grid templateColumns={`repeat(${initialColumns.length}, 1fr)`} gap={4}>
        {characters.map((row, rowIndex) =>
          row.map((char: string, colIndex: number) => (
            <GridItem
              key={`${rowIndex}-${colIndex}`}
              p={2}
              borderRadius="md"
              textAlign="center"
              bg={rowIndex === 0 || colIndex === 0 ? 'transparent' : getColor(char, initialColumns[colIndex])}
            >
              <Text fontWeight={rowIndex === 0 ? 'bold' : 'normal'}>
                {char || '-'} {getArrow(char, initialColumns[colIndex])}
              </Text>
            </GridItem>
          ))
        )}
      </Grid>
    </Box>
  );
};