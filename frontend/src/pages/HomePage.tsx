import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Button, Container,
  Heading,
  HStack,
  Text,
  VStack
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

export const HomePage = () => {
  return (
    <VStack>
      <HStack>
        <VStack>
          <Heading>GoTdle</Heading>
          <Text>Test your Game of Thrones knowledge with some fun little Games</Text>
        </VStack>
        <VStack>
          <Button> Play Now </Button>
          <Button> Login </Button>
          <Button> Register </Button>
        </VStack>
      </HStack>

        <Container width={"40em"}>
          <Accordion allowMultiple width="100%" rounded="lg" >
            <AccordionItem width="100%">
              <AccordionButton
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p={4}
                width="100%">
                <Text fontSize="md">What is GoTdle?</Text>
                <ChevronDownIcon fontSize="24px" />
              </AccordionButton>
              <AccordionPanel pb={4} width="100%">
                <Text color="gray.600">
                  GoTdle is a platform that offers a variety of Game of Thrones themed
                  games and quizzes. It is designed to test your knowledge of the popular
                  TV show and books, and provide entertainment for fans of the series.
                </Text>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem width="100%">
              <AccordionButton
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p={4}
                width="100%">
                <Text fontSize="md">Are there spoilers for the TV show?</Text>
                <ChevronDownIcon fontSize="24px" />
              </AccordionButton>
              <AccordionPanel pb={4} width="100%">
                <Text color="gray.600">
                  Yes, there may be spoilers for the TV show in some of the games and
                  quizzes on GoTdle. If you have not watched all seasons of the show and
                  want to avoid spoilers, we recommend catching up on the series before
                  playing the games.
                </Text>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem width="100%">
              <AccordionButton
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p={4}
                width="100%">
                <Text fontSize="md"> How can I play the games?</Text>
                <ChevronDownIcon fontSize="24px" />
              </AccordionButton>
              <AccordionPanel pb={4} width="100%">
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
  );
}