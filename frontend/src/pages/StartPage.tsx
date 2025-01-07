import { BaseLayout } from '../layout/BaseLayout.tsx';
import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { gotButtonStyle } from '../styles/buttonStyles.ts';
import { useNavigate } from 'react-router-dom';
import { BaseBox } from '../components/BaseBox.tsx';

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
        <VStack spacing={4} width="100%" maxWidth={'50em'} p={4}>
          <BaseBox width="100%">
            <VStack>
              <Text fontSize="4em" px={4} textAlign="center">
                Guess Game of Thrones characters
              </Text>
            </VStack>
          </BaseBox>
          <Box
            bgImage={"url('/bg_border.png')"}
            bgSize="100% 100%"
            bgRepeat="no-repeat"
            bgPosition="top"
            p={4}
            borderRadius="md"
            margin={10}
            width="100%"
          >
            <VStack py={6}>
              <Button
                sx={gotButtonStyle}
                width="95%"
                height="5em"
                onClick={() => navigate('/classic')}
              >
                <VStack>
                  <Text fontSize="2em">Classic</Text>
                  <Text>Guess with wordle like infos</Text>
                </VStack>
              </Button>
              <Button
                sx={gotButtonStyle}
                width="95%"
                height="5em"
                onClick={() => navigate('/quote')}
              >
                <VStack>
                  <Text fontSize="2em">Quote</Text>
                  <Text>Guess who said it</Text>
                </VStack>
              </Button>
              <Button
                sx={gotButtonStyle}
                width="95%"
                height="5em"
                onClick={() => navigate('/image')}
              >
                <VStack>
                  <Text fontSize="2em">Image</Text>
                  <Text>Guess from a blurred image</Text>
                </VStack>
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </BaseLayout>
  );
};
