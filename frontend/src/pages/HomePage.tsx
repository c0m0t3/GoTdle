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
import { useAuth } from '../providers/AuthProvider.tsx';
import { BaseLayout } from '../layout/BaseLayout.tsx';
import { BaseLayoutPublic } from '../layout/BaseLayoutPublic.tsx';

const LogoBox = () => (
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
);

const InfoContainer = () => (
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
              GoTdle is a platform that offers a variety of Game of Thrones
              themed games and quizzes. It is designed to test your knowledge of
              the popular TV show and books, and provide entertainment for fans
              of the series.
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
              Yes, there may be spoilers for the TV show in some of the games
              and quizzes on GoTdle. If you have not watched all seasons of the
              show and want to avoid spoilers, we recommend catching up on the
              series before playing the games.
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
            <Text>New here? Then register first to play the game.</Text>
            <Text mt={2}>
              Already logged in? Simply choose the mode between Classic, Quote,
              and Image to start the game. It is recommended to start with
              Classic and play through the modes in order!
            </Text>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </BaseBox>
  </Container>
);

export const HomePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  return (
    <>
      {isLoggedIn ? (
        <BaseLayout>
          <VStack spacing={4} width="100%" maxWidth="600px" p={4}>
            <LogoBox />
            <Button
              sx={gotButtonStyle}
              width={'15em'}
              height={'3,5em'}
              onClick={() => navigate('/classic')}
            >
              <VStack>
                <Text>Classic</Text>
                <Text>Guess with wordle like infos</Text>
              </VStack>
            </Button>
            <Button
              sx={gotButtonStyle}
              width={'15em'}
              height={'3,5em'}
              onClick={() => navigate('/quote')}
            >
              <VStack>
                <Text>Quote</Text>
                <Text>Guess who said it</Text>
              </VStack>
            </Button>
            <Button
              sx={gotButtonStyle}
              width={'15em'}
              height={'3,5em'}
              onClick={() => navigate('/image')}
            >
              <VStack>
                <Text>Image</Text>
                <Text>Guess from a blurred image</Text>
              </VStack>
            </Button>
            <InfoContainer />
          </VStack>
        </BaseLayout>
      ) : (
        <BaseLayoutPublic>
          <VStack spacing={4} width="100%" maxWidth="600px" p={4}>
            <LogoBox />

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

            <InfoContainer />
          </VStack>
        </BaseLayoutPublic>
      )}
    </>
  );
};
