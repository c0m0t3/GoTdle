import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { AiOutlineUserDelete } from 'react-icons/ai';
import { Form, Formik } from 'formik';
import { InputControl, SubmitButton } from 'formik-chakra-ui';
import { useApiClient } from '../hooks/useApiClient.ts';
import axios from 'axios';
import { object, string } from 'yup';
import { useAuth } from '../providers/AuthProvider.tsx';

type DeleteFormValues = {
  password: string;
};

const DeleteUserSchema = object({
  password: string().required('Password is required'),
});

export const DeleteUserModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const client = useApiClient();
  const toast = useToast();
  const {
    actions: { logout },
    user,
  } = useAuth();
  const userId = user?.id;

  return (
    <>
      <Flex justifyContent={'flex-end'} mb={4} mr={2}>
        <Button
          aria-label="Delete"
          size={'sm'}
          rightIcon={<AiOutlineUserDelete />}
          onClick={onOpen}
        >
          Delete Account
        </Button>
      </Flex>

      <Formik<DeleteFormValues>
        initialValues={{ password: '' }}
        validationSchema={DeleteUserSchema}
        onSubmit={async (values, formikHelpers) => {
          try {
            await client.deleteUserById(values);
            toast({
              title: 'Delete Successful',
              description: `Your account has been deleted. Hope to see you again!`,
              status: 'success',
              duration: 5000,
              isClosable: true,
              position: 'top',
            });
            formikHelpers.resetForm();
            formikHelpers.setSubmitting(false);
            localStorage.removeItem(userId || '');
            logout();
            onClose();
          } catch (error) {
            if (axios.isAxiosError(error)) {
              if (error.response?.status === 500) {
                toast({
                  title: 'Delete failed',
                  description: error.response?.data.errors[0],
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                  position: 'top',
                });
              } else {
                const errorMessage =
                  'The provided password is incorrect. Please try again.';
                formikHelpers.setFieldError('password', errorMessage);
              }
            }
          }
        }}
      >
        {({ resetForm }) => (
          <Modal
            isOpen={isOpen}
            onClose={() => {
              resetForm();
              onClose();
            }}
            isCentered={true}
          >
            <ModalOverlay />
            <ModalContent as={Form}>
              <ModalHeader textAlign="center">Delete Account</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text textAlign="center">Are you sure?</Text>
                <Text textAlign="center" mb={4}>
                  All your awesome scores will also be deleted!
                </Text>
                <InputControl
                  name="password"
                  inputProps={{
                    placeholder: 'Enter your password to confirm deletion',
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <SubmitButton colorScheme="red" mr={3}>
                  Delete
                </SubmitButton>
                <Button
                  variant="ghost"
                  onClick={() => {
                    resetForm();
                    onClose();
                  }}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </Formik>
    </>
  );
};
