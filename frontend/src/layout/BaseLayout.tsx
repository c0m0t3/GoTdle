import { Box, chakra, HStack, Image } from '@chakra-ui/react';
import './BaseLayout.css';
import { ProfileMenu } from '../components/ProfileMenu';
import ScoreboardButton from '../components/ScoreboardButton.tsx';

export const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box bg="rgb(245, 221, 181)" minH={'100vh'} display={'flex'} flexDirection={'column'}>
      <HStack p={4} bg={'rgb(110, 18, 11)'} position="relative" justifyContent="space-between" alignItems="center">
        <a href={'/'}>
          <Image src={'/Logo_GoTdle.webp'} alt="Home" className={'logo'} />
        </a>
        <Box position="absolute" left="50%" transform="translateX(-50%)" display="flex" justifyContent="center"
             alignItems="center">
          <Image
            src={'/GoTdle_Text.webp'}
            alt="GoTdle"
            className={'text-logo'}
          />
        </Box>
        <Box display="flex" gap={4} alignItems="center">
          <ScoreboardButton className="scoreboard-button" />
          <ProfileMenu className="profile-menu" />
        </Box>
      </HStack>
      <chakra.main
        flex={1}
        display="flex"
        flexDirection="column"
        alignItems="center"
        ml="auto"
        mr="auto"
        maxWidth="90rem"
        width="100%"
      >
        {children}
      </chakra.main>
    </Box>
  );
};