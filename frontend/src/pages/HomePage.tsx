import { Box, Heading, Text } from '@chakra-ui/react';
import { BaseLayout } from '../layout/BaseLayout.tsx';

const HomePage = () => {
  return (
    <BaseLayout>
      <Box p={4}>
        <Heading>Welcome to the Home Page</Heading>
        <Text>This is a simple homepage for testing purposes.</Text>
      </Box>
    </BaseLayout>
  );
};

export default HomePage;