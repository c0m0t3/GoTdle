import { BaseLayout } from '../layout/BaseLayout.tsx';
import { Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react';

export const ClassicPage: React.FC = () => {
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
            <Input placeholder="Type character name ..." />
            <Button> Submit </Button>
          </HStack>
          </Box>
        </VStack>
      </Box>
    </BaseLayout>
  );
}