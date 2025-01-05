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
        username: string()
          .min(3, 'Username must be longer than 3 characters')
          .required('Username is required')
      });
    case 'email':
      return object({
        email: string().email().required('Email is required')
      });
    case 'password':
      return object({
        password: string().min(8, 'Password must be at least 8 characters').required('Password is required')
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
        validateOnChange={false}
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
          } catch (_error) {
            toast({
              title: 'Update Failed',
              description: 'An error occurred while updating your profile. Please try again.',
              status: 'error',
              duration: 5000,
              isClosable: true,
              position: 'top'
            });
          } finally {
            formikHelpers.setSubmitting(false);
            formikHelpers.resetForm();
            onClose();
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