import { BaseLayout } from '../layout/BaseLayout.tsx';
import { AuthCard } from '../components/AuthCard.tsx';
import {
  Box,
  Heading,
  Link,
  Radio,
  RadioGroup,
  VStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { InputControl, SubmitButton } from 'formik-chakra-ui';
import { object, string } from 'yup';
import { LoginData, useAuth } from '../providers/AuthProvider.tsx';
import { gotButtonStyle } from '../styles/buttonStyles.ts';

export const LoginUserSchema = object({
  type: string().oneOf(['username', 'email']).required(),
  identifier: string().when('type', ([type], schema) =>
    type === 'email'
      ? schema
          .matches(
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Invalid email format',
          )
          .required('Email is required')
      : schema.required('Username is required'),
  ),
  password: string().required('Password is required'),
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
            identifier: '',
            password: '',
            type: 'username',
          }}
          validationSchema={LoginUserSchema}
          onSubmit={async (values) => {
            try {
              await login(values);
            } catch (_error) {
              return;
            }
          }}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <AuthCard>
                <Heading my={4}>Login</Heading>
                <VStack gap={4}>
                  <Box width={'100%'}>
                    <InputControl
                      name={'identifier'}
                      label={'E-Mail or Username'}
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
                    <RadioGroup
                      onChange={(value) => setFieldValue('type', value)}
                      value={values.type}
                    >
                      <Radio value="username" mx={1}>
                        Username
                      </Radio>
                      <Radio value="email" mx={1}>
                        Email
                      </Radio>
                    </RadioGroup>
                  </Box>
                  <InputControl
                    name={'password'}
                    label={'Password'}
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

                  <SubmitButton sx={gotButtonStyle}>Login User</SubmitButton>
                  <Box>
                    New here?{' '}
                    <Link as={RouterLink} to={'/auth/register'}>
                      Register now.
                    </Link>
                  </Box>
                </VStack>
              </AuthCard>
            </Form>
          )}
        </Formik>
      </Box>
    </BaseLayout>
  );
};
