import { BaseLayout } from '../layout/BaseLayout.tsx';
import { Box, Heading, Text } from '@chakra-ui/react';

export const QuoteModePage = () => {
  return (
    <BaseLayout>
      <Box p={4}>
        <Heading>Welcome to the Quote Mode Page</Heading>
        <Text>This is a simple quote mode page for testing purposes.</Text>
      </Box>
    </BaseLayout>
  );
};