import { BaseLayout } from '../layout/BaseLayout.tsx';
import { AuthCard } from '../components/AuthCard.tsx';
import { Box, Heading, Link, VStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { object, string } from 'yup';
import { InputControl, SubmitButton } from 'formik-chakra-ui';
import { RegisterData, useAuth } from '../providers/AuthProvider.tsx';
import { gotButtonStyle } from '../styles/buttonStyles.ts';

export const RegisterUserSchema = object({
  email: string().email().required('Email is required'),
  password: string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
  username: string().min(3, 'Username must be at least 3 characters long').required('Username is required')
});

export const RegisterPage = () => {
  const { actions: { register } } = useAuth();
  
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
            password: ''
          }}
          validationSchema={RegisterUserSchema}
          onSubmit={async (values, formikHelpers) => {
            try {
              await register(values);
              formikHelpers.setSubmitting(false);
            } catch (error: unknown) {
              if (error instanceof Error) {
                formikHelpers.setErrors({
                  email: error.message.includes('Email') ? 'Email is already in use' : '',
                  username: error.message.includes('Username') ? 'Username is already in use' : ''
                });
              }
              formikHelpers.setSubmitting(false);
            }
          }}
        >
          <Form>
            <AuthCard>
              <Heading my={4}>Registration</Heading>
              <VStack gap={4}>
                <InputControl label={'Username'} name="username" />
                <InputControl label={'E-Mail'} name="email" />
                <InputControl
                  label={'Password'}
                  name="password"
                  inputProps={{ type: 'password' }}
                />
                <SubmitButton sx={gotButtonStyle}>register</SubmitButton>
                <Box>
                  Already a user?{' '}
                  <Link as={RouterLink} to={'/auth/login'}>
                    Log in here!
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
