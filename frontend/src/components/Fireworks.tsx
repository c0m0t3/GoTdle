import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const Fireworks: React.FC = () => {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, []);

  return showConfetti ? <Confetti width={width} height={height} /> : null;
};

export default Fireworks;