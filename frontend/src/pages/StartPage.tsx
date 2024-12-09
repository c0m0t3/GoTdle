import { BaseLayout } from '../layout/BaseLayout.tsx';
import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { gotButtonStyle } from '../styles/buttonStyles.ts';
import { useNavigate } from 'react-router-dom';

export const StartPage: React.FC = () => {
  const navigate = useNavigate();

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
            margin={20}
          >
            <VStack minWidth={"30em"}>
              <Text fontSize={"4em"} px={4}> Guess Game of Thrones characters </Text>
            </VStack>
          </Box>
          <Box
            bgImage={"url('/bg_border.png')"}
            bgSize="100% 100%"
            bgRepeat="no-repeat"
            bgPosition="top"
            p={4}
            borderRadius="md"
            margin={10}
            width={"35em"}
          >
            <VStack py={6}>
              <Button style={gotButtonStyle} width={"20em"} height={"5em"} onClick={() => navigate('/classic')}>
                <VStack>
                  <Text fontSize={"2em"}> Classic </Text>
                  <Text> Guess with wordle like infos </Text>
                </VStack>
              </Button>
              <Button style={gotButtonStyle} width={"20em"} height={"5em"}>
                <VStack>
                  <Text fontSize={"2em"}> Quote </Text>
                  <Text> Guess who said it </Text>
                </VStack>
              </Button>
              <Button style={gotButtonStyle} width={"20em"} height={"5em"}>
                <VStack>
                  <Text fontSize={"2em"}> Image </Text>
                  <Text> Guess from an image section  </Text>
                </VStack>
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </BaseLayout>
  );
};