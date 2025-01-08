import { Center } from '@chakra-ui/react';
import { BaseBox } from './BaseBox.tsx';

export const AuthCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <Center h="full">
      <BaseBox minH={'25em'} w={'25em'} m={10}>
        {children}
      </BaseBox>
    </Center>
  );
};
