import { Button, ButtonProps } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { gotButtonStyle } from '../styles/buttonStyles.ts';
import React from 'react';

interface PulsingButtonProps extends ButtonProps {
  label: string;
  url: string;
}

export const PulsingButton: React.FC<PulsingButtonProps> = ({
  label,
  url,
  ...buttonProps
}) => {
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
        ease: 'easeInOut',
      }}
    >
      <Button onClick={handleClick} sx={gotButtonStyle} {...buttonProps}>
        {label}
      </Button>
    </motion.div>
  );
};
