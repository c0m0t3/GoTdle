import {
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { object, string } from 'yup';
import { Form, Formik } from 'formik';
import { InputControl, SubmitButton } from 'formik-chakra-ui';
import { useApiClient } from '../hooks/useApiClient.ts';
import axios from 'axios';

type UpdateFormValues = {
  username?: string;
  email?: string;
  password?: string;
}

const InitialValues = (editField: string | undefined) => {
  switch (editField) {
    case 'username':
      return { username: '' };
    case 'email':
      return { email: '' };
    case 'password':
      return { password: '' };
    default:
      return {};
  }
};

const UpdateUserSchema = (editField: string | undefined) => {
  switch (editField) {
    case 'username':
      return object({
        username: string().min(3, 'Username must be at least 3 characters long').required('Username is required')
      });
    case 'email':
      return object({
        email: string().matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format')
          .required('Email is required')
      });
    case 'password':
      return object({
        password: string().min(8, 'Password must be at least 8 characters long').required('Password is required')
      });
  }
};

export const UpdateUserModal = ({ editField }: { editField?: string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const client = useApiClient();
  const toast = useToast();

  return (
    <>
      <IconButton aria-label="Edit" size={'sm'} icon={<EditIcon />} onClick={onOpen} />

      <Formik<UpdateFormValues>
        initialValues={InitialValues(editField)}
        validationSchema={UpdateUserSchema(editField)}
        onSubmit={async (values, formikHelpers) => {
          try {
            await client.putUserById(values);
            toast({
              title: 'Update Successful',
              description: `Your ${editField} has been updated successfully.`,
              status: 'success',
              duration: 5000,
              isClosable: true,
              position: 'top'
            });
            formikHelpers.resetForm();
            formikHelpers.setSubmitting(false);
            onClose();
          } catch (error) {
            if (axios.isAxiosError(error)) {
              if (error.response?.status === 500) {
                toast({
                  title: 'Update failed',
                  description: error.response?.data.errors[0],
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                  position: 'top'
                });
              } else {
                const errorMessage = error.response?.data.errors;
                formikHelpers.setFieldError(editField || '', errorMessage[0]);
              }
            }
          }
        }}>
        {({ resetForm }) => (
          <Modal
            isOpen={isOpen}
            onClose={() => {
              resetForm();
              onClose();
            }}
            isCentered={true}>
            <ModalOverlay />
            <ModalContent as={Form}>
              <ModalHeader textAlign="center">Update {editField}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {editField === 'username' && (
                  <InputControl
                    name="username"
                    label="Username"
                    inputProps={{ placeholder: 'Enter new username' }}
                  />
                )}
                {editField === 'email' && (
                  <InputControl
                    name="email"
                    label="Email"
                    inputProps={{ placeholder: 'Enter new email' }}
                  />
                )}
                {editField === 'password' && (
                  <InputControl
                    name="password"
                    label="Password"
                    inputProps={{ placeholder: 'Enter new password', type: 'password' }}
                  />
                )}
              </ModalBody>
              <ModalFooter>
                <SubmitButton colorScheme="blue" mr={3}>Submit</SubmitButton>
                <Button variant="ghost" onClick={() => {
                  resetForm();
                  onClose();
                }}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </Formik>
    </>
  );
};