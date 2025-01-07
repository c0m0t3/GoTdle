import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Container,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { gotButtonStyle } from '../styles/buttonStyles.ts';
import { BaseBox } from '../components/BaseBox.tsx';

export const HomePage = () => {
  const navigate = useNavigate();

  const handlePlayNow = () => {
    navigate('/start');
  };

  return (
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
      <VStack spacing={4} width="100%" maxWidth="600px" p={4}>
        <Box
          bgImage={"url('/bg_border.png')"}
          bgSize="100% 100%"
          bgRepeat="no-repeat"
          bgPosition="top"
          p={4}
          borderRadius="md"
          width="100%"
        >
          <VStack>
            <Image
              src="/Logo_GoTdle.webp"
              alt="GoTdle Logo"
              width="20em"
              height="20em"
            />
            <Text textAlign="center">Test your Game of Thrones knowledge</Text>
          </VStack>
        </Box>

        <Button sx={gotButtonStyle} width="100%" onClick={handlePlayNow}>
          Play Now
        </Button>
        <Button
          sx={gotButtonStyle}
          width={'15em'}
          onClick={() => navigate('/auth/login')}
        >
          {' '}
          Login{' '}
        </Button>
        <Button
          sx={gotButtonStyle}
          width={'15em'}
          onClick={() => navigate('/auth/register')}
        >
          {' '}
          Register{' '}
        </Button>

        <Container p={0}>
          <BaseBox width={'auto'}>
            <Accordion allowMultiple>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    What is GoTdle?
                  </Box>
                  <ChevronDownIcon />
                </AccordionButton>
                <AccordionPanel>
                  <Text>
                    GoTdle is a platform that offers a variety of Game of
                    Thrones themed games and quizzes. It is designed to test
                    your knowledge of the popular TV show and books, and provide
                    entertainment for fans of the series.
                  </Text>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Are there spoilers for the TV show?
                  </Box>
                  <ChevronDownIcon />
                </AccordionButton>
                <AccordionPanel>
                  <Text>
                    Yes, there may be spoilers for the TV show in some of the
                    games and quizzes on GoTdle. If you have not watched all
                    seasons of the show and want to avoid spoilers, we recommend
                    catching up on the series before playing the games.
                  </Text>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    How can I play the games?
                  </Box>
                  <ChevronDownIcon />
                </AccordionButton>
                <AccordionPanel>
                  <Text>
                    Just click on the "Play Now" button at the top of the page
                    to get started. If you want to track your progress and
                    compete with other players, you can create an account and
                    log in to access additional features.
                  </Text>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </BaseBox>
        </Container>
      </VStack>
    </Box>
  );
};
