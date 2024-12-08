import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Container,
  Text,
  VStack,
  Image
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { gotButtonStyle } from '../styles/buttonStyles.ts';

export const HomePage = () => {
  const navigate = useNavigate();

  const handlePlayNow = () => {
    navigate('/start');
  }
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
      <VStack>
          <Box
            bgImage={"url('/bg_border.png')"}
            bgSize="100% 100%"
            bgRepeat="no-repeat"
            bgPosition="top"
            p={4}
            borderRadius="md"
            margin={10}
          >
            <VStack minWidth={"35em"}>
              <Image src="/Logo_GoTdle.webp" alt="GoTdle Logo" width="200px" height="200px" />
              <Text>Test your Game of Thrones knowledge </Text>
            </VStack>
          </Box>

            <Button sx={gotButtonStyle} width={"15em"} onClick={handlePlayNow}> Play Now </Button>
            <Button sx={gotButtonStyle} width={"15em"}> Login </Button>
            <Button sx={gotButtonStyle} width={"15em"}> Register </Button>

        <Container width={"40em"}>
          <Accordion
            allowMultiple
            width="100%"
            rounded="lg"
            bgImage={"url('/bg_border.png')"}
            bgSize="100% 100%"
            bgRepeat="no-repeat"
            bgPosition="top"
            p={4}
          >
            <AccordionItem width="100%" border="none">
              <AccordionButton
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p={4}
                borderRadius="md"
                _hover={{ bg: "gray.200" }}
                width="100%"
              >
                <Text fontSize="md" fontWeight="bold">What is GoTdle?</Text>
                <ChevronDownIcon fontSize="24px" />
              </AccordionButton>
              <AccordionPanel pb={4} width="100%" borderRadius="md">
                <Text color="gray.600">
                  GoTdle is a platform that offers a variety of Game of Thrones themed
                  games and quizzes. It is designed to test your knowledge of the popular
                  TV show and books, and provide entertainment for fans of the series.
                </Text>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem width="100%" border="none">
              <AccordionButton
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p={4}
                borderRadius="md"
                _hover={{ bg: "gray.200" }}
                width="100%"
              >
                <Text fontSize="md" fontWeight="bold">Are there spoilers for the TV show?</Text>
                <ChevronDownIcon fontSize="24px" />
              </AccordionButton>
              <AccordionPanel pb={4} width="100%" borderRadius="md">
                <Text color="gray.600">
                  Yes, there may be spoilers for the TV show in some of the games and
                  quizzes on GoTdle. If you have not watched all seasons of the show and
                  want to avoid spoilers, we recommend catching up on the series before
                  playing the games.
                </Text>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem width="100%" border="none">
              <AccordionButton
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p={4}
                borderRadius="md"
                _hover={{ bg: "gray.200" }}
                width="100%"
              >
                <Text fontSize="md" fontWeight="bold">How can I play the games?</Text>
                <ChevronDownIcon fontSize="24px" />
              </AccordionButton>
              <AccordionPanel pb={4} width="100%" borderRadius="md">
                <Text color="gray.600">
                  Just click on the "Play Now" button at the top of the page to get started.
                  If you want to track your progress and compete with other players, you can create
                  an account and log in to access additional features.
                </Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Container>
      </VStack>
    </Box>
  );
}

