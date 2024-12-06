import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Container,
  Text,
  VStack
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

export const HomePage = () => {
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
            <VStack>
              <Text>Test your Game of Thrones knowledge with some fun little Games</Text>
            </VStack>
          </Box>

            <Button sx={gotButtonStyle}> Play Now </Button>
            <Button sx={gotButtonStyle}> Login </Button>
            <Button sx={gotButtonStyle}> Register </Button>

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

const gotButtonStyle = {
  background: 'rgb(120, 0, 0)',
  color: 'white',
  fontSize: '1.2em',
  border: '2px solid #D2B48C',
  borderRadius: '8px',
  padding: '0.5em 1em',
  //fontFamily: 'MedievalSharp, serif',
  textShadow: '1px 1px 2px #000',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  width: '15em',
  marginBottom: '20px',
  _hover: {
    background: 'rgb(100, 0, 0)',
    borderColor: '#DEB887',
  },
  _active: {
    background: 'rgb(80, 0, 0)',
    borderColor: '#8B4513',
  },
};