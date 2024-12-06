import { BaseLayout } from '../layout/BaseLayout.tsx';
import { Box, Heading, Text } from '@chakra-ui/react';
import { useQuoteApi } from '../hooks/useQuoteApi.ts';
import { useEffect } from 'react';

export const QuoteModePage = () => {
  const { fetchApi, apiData } = useQuoteApi();

  useEffect(() => {
    fetchApi().catch((error) => {
      console.error('Failed to fetch quote:', error);
    });
  }, [fetchApi]);

  return (
    <BaseLayout>
      <Box p={4}>
        <Heading>Welcome to the Quote Mode Page</Heading>
        <Text>This is a simple quote mode page for testing purposes.</Text>
        <Text>Quote of the Day: {apiData?.sentence} By: {apiData?.character.name}</Text>
      </Box>
    </BaseLayout>
  );
};