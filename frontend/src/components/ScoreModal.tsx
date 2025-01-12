import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

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
  return (
    <Modal isOpen={show} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Score Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <p>Streak: {user.score.streak}</p>
          <p>Longest Streak: {user.score.longestStreak}</p>
          <p>Daily Score: {user.score.dailyScore.join(', ')}</p>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
