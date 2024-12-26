import { BaseLayout } from '../layout/BaseLayout.tsx';
import { AuthCard } from '../components/AuthCard.tsx';
import { Box, Button, Heading, Link, VStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { object, string } from 'yup';
import { InputControl } from 'formik-chakra-ui';
import { RegisterData } from '../providers/AuthProvider.tsx';

export const RegisterUserSchema = object({
  email: string().required(),
  password: string().required(),
  username: string().required().min(2, 'Mindestens 3 Zeichen'),
});

export const RegisterPage = () => {
  return (
    <BaseLayout>
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
        <Formik<RegisterData>
          initialValues={{
            username: '',
            email: '',
            password: '',
          }}
          validationSchema={RegisterUserSchema}
          onSubmit={(values, formikHelpers) => {}}
        >
          <Form>
            <AuthCard>
              <Heading my={4}>Register Page</Heading>
              <VStack alignItems="flex-start" gap={4}>
                <InputControl label={'Username'} name="username" />
                <InputControl label={'E-Mail'} name="email" />
                <InputControl
                  label={'Password'}
                  inputProps={{ type: 'password' }}
                  name="password"
                />
                <Button type={'submit'}>Registrieren</Button>
                <Box>
                  Bereits ein Konto?{' '}
                  <Link as={RouterLink} to={'/auth/login'}>
                    Anmelden
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
