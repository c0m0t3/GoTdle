import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../src/providers/AuthProvider';
import { render } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';

const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <AuthProvider>{children}</AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
};

const customRender = (ui: ReactElement) =>
  render(ui, { wrapper: AllTheProviders });

// re-export everything
// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';

// override render method
export { customRender as render };
