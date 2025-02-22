import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useClipboard } from '@chakra-ui/hooks';
import { BaseBox } from './BaseBox.tsx';

interface ScoreModalProps {
  user: {
    id: string;
    email: string;
    username: string;
    createdAt: string;
    score: {
      streak: number;
      lastPlayed: string | null;
      longestStreak: number;
      dailyScore: number[];
      recentScores: number[][];
    };
  };
  show: boolean;
  handleClose: () => void;
}

export const ScoreModal: React.FC<ScoreModalProps> = ({
  user,
  show,
  handleClose,
}) => {
  const totalScore = user.score.dailyScore.reduce((a, b) => a + b, 0);
  const scoreText = `I've completed all the modes of #GoTdle today:\n❓ Classic: ${user.score.dailyScore[0]}\n💬 Quote: ${user.score.dailyScore[1]}\n🎨 Image: ${user.score.dailyScore[2]}\n🟰Total: ${totalScore}\n🔥Streak: ${user.score.streak}\nhttps://gotdle.net`;
  const { hasCopied, onCopy } = useClipboard(scoreText);

  const tweetText = encodeURIComponent(scoreText);
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  return (
    <Modal isOpen={show} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="rgb(110, 18, 11)" color="white" borderRadius="md" p={4}>
        <ModalHeader textAlign="center">🎉 Congratulations! 🎉</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6}>
            <Text fontSize="lg" textAlign="center">
              You've completed all the modes for today!
            </Text>
            <BaseBox
              width={{ base: '90%', md: '70%' }}
              borderRadius="md"
              p={4}
              color="black"
              boxShadow="md"
            >
              <VStack spacing={3} align="stretch">
                <HStack justify="space-between">
                  <Text fontSize="lg" fontWeight="bold">
                    ❓ Classic:
                  </Text>
                  <Text fontSize="lg">{user.score.dailyScore[0]}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="lg" fontWeight="bold">
                    💬 Quote:
                  </Text>
                  <Text fontSize="lg">{user.score.dailyScore[1]}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="lg" fontWeight="bold">
                    🎨 Image:
                  </Text>
                  <Text fontSize="lg">{user.score.dailyScore[2]}</Text>
                </HStack>
                <Text fontSize="lg" fontWeight="bold" textAlign="right">
                  Total: {totalScore}
                </Text>
                <Text fontSize="lg" textAlign="right">
                  🔥 Streak: {user.score.streak}
                </Text>
              </VStack>
            </BaseBox>
            <Text fontSize="md" textAlign="center">
              {' '}
              <Text as="a" href="https://gotdle.net">
                https://gotdle.net
              </Text>
            </Text>
            <HStack spacing={4}>
              <Button onClick={onCopy} colorScheme="blue">
                {hasCopied ? 'Copied' : 'Copy Scores'}
              </Button>
              <Button as="a" href={tweetUrl} target="_blank" colorScheme="teal">
                Share on X
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button colorScheme="blackAlpha" onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
