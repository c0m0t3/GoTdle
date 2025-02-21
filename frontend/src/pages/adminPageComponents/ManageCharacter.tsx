import { useState } from 'react';
import {
  Button,
  Divider,
  Input,
  Text,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useApiClient } from '../../hooks/useApiClient.ts';
import { AxiosError } from 'axios';
import { gotButtonStyleII } from '../../styles/buttonStyles.ts';

export const ManageCharacter = () => {
  const client = useApiClient();
  const toast = useToast();
  const [jsonContent, setJsonContent] = useState<string>('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setJsonContent(e.target?.result as string);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    try {
      const parsedJson = JSON.parse(jsonContent);
      await client.postCreateCharacters(parsedJson);
      toast({
        title: 'Success',
        description: 'Character successfully created',
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ errors?: string[] }>;
      const errorMessage =
        axiosError.response?.data?.errors?.[0] || 'An unknown error occurred';
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const onDeleteAllCharacters = async () => {
    await client.deleteAllCharacters();
    toast({
      title: 'Success',
      description: 'All characters successfully deleted',
      status: 'success',
      duration: 4000,
      isClosable: true,
      position: 'top',
    });
  };

  return (
    <VStack>
      <Text fontWeight="bold" fontSize={'lg'}>
        Create Characters
      </Text>

      <Button
        as="label"
        htmlFor="file-upload"
        sx={gotButtonStyleII}
        _hover={{ cursor: 'pointer', bg: 'blue.600' }}
      >
        Upload JSON File
      </Button>
      <Input
        id="file-upload"
        type="file"
        accept="application/json"
        onChange={handleFileUpload}
        hidden
      />
      <Textarea
        value={jsonContent}
        onChange={(e) => setJsonContent(e.target.value)}
        height="200px"
        overflowY="scroll"
      />
      <Button onClick={handleSubmit} sx={gotButtonStyleII}>
        Submit
      </Button>

      <Divider borderColor={'black'} my={'4'} />

      <Button
        sx={{ ...gotButtonStyleII, color: 'red.600' }}
        onClick={onDeleteAllCharacters}
      >
        Delete All Characters
      </Button>
    </VStack>
  );
};
