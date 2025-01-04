import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const ScoreboardButton = () => {
  const navigate = useNavigate();
  const navigateToScoreboard = () => {
    navigate('/scoreboard');
  };
  return (
    <Button onClick={navigateToScoreboard} className="scoreboard-button">
      <img src="/icons/barChart_static.png" alt="Score Icon" className="static-icon"
           style={{ width: '2em', height: '2em' }} />
    </Button>
  );
};

export default ScoreboardButton;