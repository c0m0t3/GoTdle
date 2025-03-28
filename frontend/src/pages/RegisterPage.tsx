import { AuthCard } from '../components/AuthCard.tsx';
import { Box, Heading, Link, VStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { object, string } from 'yup';
import { InputControl, SubmitButton } from 'formik-chakra-ui';
import { RegisterData, useAuth } from '../providers/AuthProvider.tsx';
import { gotButtonStyle } from '../styles/buttonStyles.ts';
import { inputFieldStyles } from '../styles/inputFieldStyles.ts';
import { BaseLayoutPublic } from '../layout/BaseLayoutPublic.tsx';

export const RegisterUserSchema = object({
  email: string()
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Invalid email format',
    )
    .required('Email is required'),
  password: string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(/^[^'";<>&]*$/, 'Password contains forbidden characters')
    .required('Password is required'),
  username: string()
    .min(3, 'Username must be at least 3 characters long')
    .matches(/^[^'";<>&]*$/, 'Username contains forbidden characters')
    .required('Username is required'),
});

export const RegisterPage = () => {
  const {
    actions: { register },
  } = useAuth();

  return (
    <BaseLayoutPublic>
      <Formik<RegisterData>
        initialValues={{
          username: '',
          email: '',
          password: '',
        }}
        validationSchema={RegisterUserSchema}
        onSubmit={async (values, formikHelpers) => {
          try {
            await register(values);
            formikHelpers.setSubmitting(false);
          } catch (error: unknown) {
            if (error instanceof Error) {
              formikHelpers.setErrors({
                email: error.message.includes('Email')
                  ? 'Email is already in use'
                  : '',
                username: error.message.includes('Username')
                  ? 'Username is already in use'
                  : '',
              });
            }
            formikHelpers.setSubmitting(false);
          }
        }}
      >
        <Form>
          <AuthCard>
            <Heading fontFamily="MedievalSharp, serif" my={4}>
              Registration
            </Heading>
            <VStack gap={4}>
              <InputControl
                label={'Username'}
                name="username"
                inputProps={{
                  placeholder: 'min. 3 characters, without \'";<>&',
                  sx: inputFieldStyles,
                }}
              />
              <InputControl
                label={'E-Mail'}
                name="email"
                inputProps={{
                  sx: inputFieldStyles,
                }}
              />
              <InputControl
                label={'Password'}
                name="password"
                inputProps={{
                  type: 'password',
                  placeholder: 'min. 8 characters, without \'";<>&',
                  sx: inputFieldStyles,
                }}
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
    </BaseLayoutPublic>
  );
};
