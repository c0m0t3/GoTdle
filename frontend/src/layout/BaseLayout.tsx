import {
  Box,
  Button,
  chakra,
  HStack,
  Image,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { MouseEventHandler } from 'react';
import { MoonIcon, SunIcon, ViewIcon } from '@chakra-ui/icons';
//import { useAuth } from '../providers/AuthProvider.tsx';
import { useNavigate } from 'react-router-dom';

const ColorModeToggle = () => {
  const { toggleColorMode } = useColorMode();

  const icon = useColorModeValue(<MoonIcon />, <SunIcon />);
  const onClickToggle: MouseEventHandler<HTMLButtonElement> = () => {
    toggleColorMode();
    console.log('Toggle Color Mode');
  };
  return <Button onClick={onClickToggle}>{icon}</Button>;
};

const ScoreboardButton = () => {
  const navigate = useNavigate();
  const navigateToScoreboard = () => {
    navigate('/scoreboard');
  };
  return (
    <Button onClick={navigateToScoreboard} leftIcon={<ViewIcon />}>
      Scoreboard
    </Button>
  );
};

const LoginButtonDummy = () => {
  return <Button>Login</Button>;
};

//const LoginButton = () => {
//  const navigate = useNavigate();
//  const navigateToLogin = () => {
//    navigate('/auth/login');
//  };
//  const {
//    isLoggedIn,
//    actions: { logout },
//  } = useAuth();
//
//  if (isLoggedIn) {
//    return (
//      <Button
//        onClick={() => {
//          logout();
//        }}
//      >
//        Logout
//      </Button>
//    );
//  }
//  return (
//    <Button
//      onClick={() => {
//        navigateToLogin();
//      }}
//    >
//      Login
//    </Button>
//  );
//};

export const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      bg={'gray.200'}
      _dark={{ bg: 'gray.800' }}
      minH={'100vh'}
      display={'flex'}
      flexDirection={'column'}
    >
      <HStack p={4} bg={'rgb(43, 45, 48)'} justifyContent="space-between">
        <a href={'/'}>
          <Image src={'/Logo_GoTdle.webp'} alt="Home" boxSize="5em" />
        </a>
        <Box flex={1} display="flex" justifyContent="center">
          <Image
            src={'/GoTdle_Text.webp'}
            alt="GoTdle"
            width="25em"
            height="auto"
          />
        </Box>
        <Box gap={4} display={'flex'}>
          <ScoreboardButton />
          <LoginButtonDummy />
          <ColorModeToggle />
        </Box>
      </HStack>
      <chakra.main
        flex={1}
        px={4}
        py={8}
        overflowX="hidden"
        display="flex"
        flexDirection="column"
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
