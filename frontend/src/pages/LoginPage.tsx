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
import { inputFieldStyles } from '../styles/inputFieldStyles.ts';
import { BaseLayoutPublic } from '../layout/BaseLayoutPublic.tsx';

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
    <BaseLayoutPublic>
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
              <Heading fontFamily="MedievalSharp, serif" my={4}>
                Login
              </Heading>
              <VStack gap={4}>
                <Box width={'100%'}>
                  <InputControl
                    name={'identifier'}
                    label={'E-Mail or Username'}
                    inputProps={{
                      sx: inputFieldStyles,
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
                    sx: inputFieldStyles,
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
    </BaseLayoutPublic>
  );
};
