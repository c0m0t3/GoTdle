import { Box, Center } from '@chakra-ui/react';

export const AuthCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <Center h="full">
      <Box
        minH="400px"
        w="400px"
        // borderRadius="lg"
        boxShadow="md"
        p={4}
        bgImage={"url('/bg_border.png')"}
        // _dark={{ bg: 'gray.700' }}
        bgSize="100% 100%"
        bgRepeat="no-repeat"
        bgPosition="top"
        // borderRadius="md"
        margin={10}
        border="none"
      >
        {children}
      </Box>
    </Center>
  );
};
