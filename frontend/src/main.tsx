import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './AppRoutes.tsx';
//import { AuthProvider } from './providers/AuthProvider.tsx'; wird um AppRoutes.tsx ergänzt

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
          <AppRoutes />
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>,
);
