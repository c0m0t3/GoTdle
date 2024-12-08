import { Box, Grid, GridItem, Text } from '@chakra-ui/react';

interface CharacterGridProps {
  characterData: string[][];
}

export const CharacterGrid: React.FC<CharacterGridProps> = ({ characterData }) => {
  const initialColumns = ["Character", "Gender", "House", "Origin", "Status", "Religion", "First Appearance", "Last Appearance"];
  const characters = [initialColumns, ...characterData];

  return (
    <Box
      bgImage={"url('/bg_border.png')"}
      bgSize="100% 100%"
      bgRepeat="no-repeat"
      bgPosition="top"
      p={4}
    >
      <Grid templateColumns={`repeat(${initialColumns.length}, 1fr)`} gap={4}>
        {characters.map((row, rowIndex) =>
          row.map((char, colIndex) => (
            <GridItem
              key={`${rowIndex}-${colIndex}`}
              p={2}
              borderRadius="md"
              textAlign="center"
            >
              <Text fontWeight={rowIndex === 0 ? "bold" : "normal"}>
                {char || "-"}
              </Text>
            </GridItem>
          ))
        )}
      </Grid>
    </Box>
  );
};