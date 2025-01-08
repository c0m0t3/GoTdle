import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

interface ScoreboardButtonProps {
  className?: string;
}

const ScoreboardButton: React.FC<ScoreboardButtonProps> = ({ className }) => {
  const navigate = useNavigate();
  const navigateToScoreboard = () => {
    navigate('/scoreboard');
  };

  return (
    <Button onClick={navigateToScoreboard} className={className}>
      <img
        src="/icons/barChart_static.png"
        alt="Score Icon"
        className="static-icon"
        style={{ width: '2em', height: '2em' }}
      />
    </Button>
  );
};

export default ScoreboardButton;
