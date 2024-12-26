import { BaseLayout } from '../layout/BaseLayout.tsx';
import { AuthCard } from '../components/AuthCard.tsx';
import { Box, Button, Heading, Link, VStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { InputControl } from 'formik-chakra-ui';
import { object, string } from 'yup';
import { LoginData, useAuth } from '../providers/AuthProvider.tsx';

export const LoginUserSchema = object({
  email: string().required(),
  password: string().required(),
});

export const LoginPage = () => {
  const {
    actions: { login },
  } = useAuth();
  return (
    <BaseLayout>
      <Box
        bg="rgb(245, 221, 181)"
        minH="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        m={0}
        p={4}
        border="none"
      >
        <Formik<LoginData>
          initialValues={{
            email: '',
            password: '',
          }}
          onSubmit={(values) => {
            login(values);
          }}
          validationSchema={LoginUserSchema}
        >
          <Form>
            <AuthCard>
              <Heading my={4}>Login Page</Heading>
              <VStack alignItems="flex-start" gap={4}>
                <InputControl
                  name={'email'}
                  label={'E-Mail'}
                  inputProps={{
                    bg: 'rgb(250, 240, 220)',
                    border: '2px solid rgb(200, 160, 120)',
                    borderRadius: '8px',
                    padding: '10px',
                    _focus: {
                      borderColor: 'rgb(180, 90, 70)',
                      boxShadow: 'none',
                      bg: 'rgb(250, 240, 220)',
                    },
                    _hover: {
                      bg: 'rgb(250, 240, 220)',
                      borderColor: 'rgb(200, 160, 120)',
                    },
                  }}
                />
                <InputControl
                  name={'password'}
                  label={'Passwort'}
                  inputProps={{
                    type: 'password',
                    bg: 'rgb(250, 240, 220)',
                    border: '2px solid rgb(200, 160, 120)',
                    borderRadius: '8px',
                    padding: '10px',
                    _focus: {
                      borderColor: 'rgb(180, 90, 70)',
                      boxShadow: 'none',
                      bg: 'rgb(250, 240, 220)',
                    },
                    _hover: {
                      bg: 'rgb(250, 240, 220)',
                      borderColor: 'rgb(200, 160, 120)',
                    },
                  }}
                />

                <Button type={'submit'}>Login User</Button>
                <Box>
                  Neu hier?{' '}
                  <Link as={RouterLink} to={'/auth/register'}>
                    Registrieren
                  </Link>
                </Box>
              </VStack>
            </AuthCard>
          </Form>
        </Formik>
      </Box>
    </BaseLayout>
  );
};
