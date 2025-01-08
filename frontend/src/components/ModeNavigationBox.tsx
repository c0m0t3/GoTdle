import { useNavigate } from 'react-router-dom';
import { Button, HStack } from '@chakra-ui/react';
import { BaseBox } from './BaseBox.tsx';
import { gotButtonStyle } from '../styles/buttonStyles.ts';
import { FaImage, FaQuestionCircle, FaQuoteRight } from 'react-icons/fa';

export const ModeNavigationBox = () => {
  const navigate = useNavigate();

  return (
    <BaseBox
      width={'35em'}
      display="flex"
      flexDirection="column"
      alignItems="center"
      m={4}
    >
      <HStack>
        <Button
          sx={gotButtonStyle}
          width={'8em'}
          leftIcon={<FaQuestionCircle />}
          onClick={() => navigate('/classic')}
        >
          {' '}
          Classic{' '}
        </Button>
        <Button
          sx={gotButtonStyle}
          width={'8em'}
          leftIcon={<FaQuoteRight />}
          onClick={() => navigate('/quote')}
        >
          {' '}
          Quote{' '}
        </Button>
        <Button
          sx={gotButtonStyle}
          width={'8em'}
          leftIcon={<FaImage />}
          onClick={() => navigate('/image')}
        >
          {' '}
          Image{' '}
        </Button>
      </HStack>
    </BaseBox>
  );
};
