import { Box, Button, chakra, HStack, Image } from '@chakra-ui/react';
import './BaseLayout.css';
//import { useAuth } from '../providers/AuthProvider.tsx';
import { useNavigate } from 'react-router-dom';


const ScoreboardButton = () => {
  const navigate = useNavigate();
  const navigateToScoreboard = () => {
    navigate('/scoreboard');
  };
  return (
    <Button onClick={navigateToScoreboard} className="scoreboard-button">
      <img src="/icons/barChart_static.png" alt="Score Icon" className="static-icon" />
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
    <Box>
      <HStack p={4} bg={'rgb(43, 45, 48)'} position="relative" justifyContent="space-between" alignItems="center">
        <a href={'/'}>
          <Image src={'/Logo_GoTdle.webp'} alt="Home" boxSize="5em" />
        </a>
        <Box position="absolute" left="50%" transform="translateX(-50%)" display="flex" justifyContent="center"
             alignItems="center">
          <Image
            src={'/GoTdle_Text.webp'}
            alt="GoTdle"
            width="25em"
            height="auto"
          />
        </Box>
        <Box display="flex" gap={4} alignItems="center">
          <ScoreboardButton />
          <LoginButtonDummy />
        </Box>
      </HStack>
      <Box
        bg="rgb(245, 221, 181)"
        minH="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        m={0}
        p={0}
        border="none"
      >
        <chakra.main
          flex={1}
          display="flex"
          flexDirection="column"
          ml="auto"
          mr="auto"
        >
          {children}
        </chakra.main>
      </Box>
    </Box>
  );
};