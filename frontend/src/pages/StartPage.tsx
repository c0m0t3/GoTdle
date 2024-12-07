import { BaseLayout } from '../layout/BaseLayout.tsx';
import { Box, Heading } from '@chakra-ui/react';

export const StartPage: React.FC = () => {
  return (
    <BaseLayout>
      <Box>
        <Heading>Gotdle</Heading>
      </Box>
    </BaseLayout>
  );
};