import { Box, chakra, HStack, Image } from '@chakra-ui/react';
import '../styles/BaseLayout.css';
import { ProfileMenu } from '../components/ProfileMenu';
import ScoreboardButton from '../components/ScoreboardButton.tsx';

export const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      bg="rgb(245, 221, 181)"
      minH={'100vh'}
      display={'flex'}
      flexDirection={'column'}
    >
      <HStack
        p={4}
        bg={'rgb(110, 18, 11)'}
        position="relative"
        justifyContent="space-between"
        alignItems="center"
      >
        <a href={'/'}>
          <Image src={'/Logo_GoTdle.webp'} alt="Home" className={'logo'} />
        </a>
        <Box
          position="absolute"
          left="50%"
          transform="translateX(-50%)"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
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
        width="100%"
      >
        {children}
      </chakra.main>
      <Box
        as="footer"
        p={4}
        bg={'rgb(110, 18, 11)'}
        color="white"
        textAlign="center"
        mt={10}
      >
        <Box mb={4}>
          <a href="mailto:support@GoTdle.com">Contact Us</a>
        </Box>
        <Box mb={4}>
          <a
            href="https://code.fbi.h-da.de/sthiohnoo/gotdle"
            target="_blank"
            rel="noopener noreferrer"
          >
            About
          </a>
        </Box>
        <Box mb={4}>
          &copy; {new Date().getFullYear()} HiCo-BenRun. All rights reserved.
        </Box>
      </Box>
    </Box>
  );
};
