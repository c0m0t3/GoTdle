import { Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const PulsingButton = ({ label, url }: { label: string; url: string }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(url);
  };

  return (
    <motion.div
      animate={{ scale: [1, 1.1, 1] }}
      transition={{
        duration: 1,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut'
      }}
    >
      <Button onClick={handleClick}>
        {label}
      </Button>
    </motion.div>
  );
};
