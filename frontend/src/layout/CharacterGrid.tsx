import { Box, Grid, GridItem, Text } from '@chakra-ui/react';
import '../styles/CharacterGrid.css';

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
  solutionCharacter: Character | null;
}

export const CharacterGrid: React.FC<CharacterGridProps> = ({
  characterData,
  solutionCharacter,
}) => {
  const initialColumns = [
    'Character',
    'Gender',
    'House',
    'Origin',
    'Status',
    'Religion',
    'First Appearance',
    'Last Appearance',
  ];

  const transformCharacterData = (data: Character[]): string[][] => {
    return data.map((character: Character) => [
      character.name,
      character.gender,
      character.house,
      character.origin,
      character.status,
      character.religion,
      character.seasons[0] ? `S${character.seasons[0]}` : '',
      character.seasons[character.seasons.length - 1]
        ? `S${character.seasons[character.seasons.length - 1]}`
        : '',
    ]);
  };

  const characters = [initialColumns, ...transformCharacterData(characterData)];

  const getColor = (value: string, column: string) => {
    if (solutionCharacter) {
      if (column === 'First Appearance') {
        const solutionValue = `S${solutionCharacter.seasons[0]}`;
        return value === solutionValue ? 'green.500' : 'red.500';
      } else if (column === 'Last Appearance') {
        const solutionValue = `S${solutionCharacter.seasons[solutionCharacter.seasons.length - 1]}`;
        return value === solutionValue ? 'green.500' : 'red.500';
      } else {
        const solutionValue =
          solutionCharacter[column.toLowerCase() as keyof Character];
        return value === solutionValue ? 'green.500' : 'red.500';
      }
    }
    return 'red.200';
  };

  const getArrow = (value: string, column: string, rowIndex: number) => {
    if (rowIndex === 0) return '';
    if (solutionCharacter) {
      if (column === 'First Appearance') {
        const solutionValue = `S${solutionCharacter.seasons[0]}`;
        return value === solutionValue ? '' : value < solutionValue ? '↑' : '↓';
      } else if (column === 'Last Appearance') {
        const solutionValue = `S${solutionCharacter.seasons[solutionCharacter.seasons.length - 1]}`;
        return value === solutionValue ? '' : value < solutionValue ? '↑' : '↓';
      }
    }
    return '';
  };

  return (
    <Box
      bg="rgba(79, 0, 0, 1)"
      p={4}
      px={'4em'}
      border="1px solid"
      borderColor="white.600"
      borderRadius="md"
      textColor={'white'}
      className={'character-grid'}
      minWidth={'90em'}
    >
      <Grid templateColumns="1.1fr 1fr 1fr 1.1fr 1fr 1.1fr 0.9fr 0.9fr" gap={2}>
        {characters.map((row, rowIndex) =>
          row.map((char: string, colIndex: number) => (
            <GridItem
              key={`${rowIndex}-${colIndex}`}
              className="character-card"
              p={2}
              borderRadius="md"
              textAlign="center"
              bg={
                rowIndex === 0 || colIndex === 0
                  ? 'transparent'
                  : getColor(char, initialColumns[colIndex])
              }
            >
              <Text fontWeight={rowIndex === 0 ? 'bold' : 'normal'}>
                {char || '-'}{' '}
                {getArrow(char, initialColumns[colIndex], rowIndex)}
              </Text>
            </GridItem>
          )),
        )}
      </Grid>
    </Box>
  );
};
