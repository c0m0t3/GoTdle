import { useState } from 'react';
import {
  Button,
  Divider,
  HStack,
  Input,
  Spinner,
  Text,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useApiClient } from '../../hooks/useApiClient.ts';
import { AxiosError } from 'axios';
import { gotButtonStyleII } from '../../styles/buttonStyles.ts';
import * as yup from 'yup';
import { array, number, object, string } from 'yup';
import { inputFieldStyles } from '../../styles/inputFieldStyles.ts';
import { CharacterData } from './CharacterCard.tsx';

const expectedKeys = [
  '_id',
  'name',
  'gender',
  'born',
  'origin',
  'death',
  'status',
  'culture',
  'religion',
  'titles',
  'house',
  'father',
  'mother',
  'spouse',
  'children',
  'siblings',
  'lovers',
  'seasons',
  'actor',
];
const validateKeys = (
  data: CharacterData | CharacterData[],
  isArray: boolean,
  index?: number,
) => {
  const errors: string[] = [];

  if (isArray && Array.isArray(data)) {
    data.forEach((item, idx) => {
      const missingKeys = expectedKeys.filter((key) => !(key in item));
      if (missingKeys.length > 0) {
        errors.push(
          `Object at index ${idx}: Missing or incorrect keys: ${missingKeys.join(', ')}`,
        );
      }
    });
  } else {
    const missingKeys = expectedKeys.filter((key) => !(key in data));
    if (missingKeys.length > 0) {
      const idx = index !== undefined ? index : 'unknown';
      errors.push(
        `Object at index ${idx}: Missing or incorrect keys: ${missingKeys.join(', ')}`,
      );
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }
};

export const CharacterSchema = array()
  .of(
    object({
      _id: number().required('ID is required'),
      name: string().required('Name is required'),
      gender: string(),
      born: string(),
      origin: string(),
      death: string(),
      status: string(),
      culture: string(),
      religion: string(),
      titles: array().of(string()),
      house: string(),
      father: string(),
      mother: string(),
      spouse: array().of(string()),
      children: array().of(string()),
      siblings: array().of(string()),
      lovers: array().of(string()),
      seasons: array().of(number()),
      actor: string(),
    }),
  )
  .strict()
  .required();

export const ManageCharacter = () => {
  const client = useApiClient();
  const toast = useToast();
  const [jsonContent, setJsonContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setJsonContent(e.target?.result as string);
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const parsedJson = JSON.parse(jsonContent);

      if (Array.isArray(parsedJson)) {
        validateKeys(parsedJson, true);
      } else {
        validateKeys(parsedJson, false, 0);
      }
      await CharacterSchema.validate(parsedJson, { abortEarly: false });

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
      let errorMessage;

      if (error instanceof yup.ValidationError) {
        errorMessage = error.inner
          .map((err) => {
            const index = err.path?.split('[')[1]?.split(']')[0] || 'unknown';
            const message = err.message
              .replace(/^\[.*]\./, '')
              .replace(/, but.*$/, '');
            return `Object at index ${index}: ${message}`;
          })
          .join('\n');
      } else if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<{ errors?: string[] }>;
        errorMessage =
          axiosError.response?.data?.errors?.[0] || 'An unknown error occurred';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = 'An unknown error occurred';
      }
      toast({
        title: 'Error',
        description: (
          <div style={{ whiteSpace: 'pre-line' }}>{errorMessage}</div>
        ),
        status: 'error',
        duration: 6000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setIsLoading(false);
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

      <HStack width="100%" justifyContent="start">
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
      </HStack>
      <Textarea
        value={jsonContent}
        onChange={(e) => setJsonContent(e.target.value)}
        height="20em"
        overflowY="scroll"
        sx={inputFieldStyles}
        spellCheck={false}
      />
      <HStack width="100%" justifyContent="end">
        <Button onClick={() => setJsonContent('')} sx={gotButtonStyleII}>
          Clear
        </Button>
        <Button
          onClick={handleSubmit}
          size={'md'}
          sx={gotButtonStyleII}
          disabled={!jsonContent || isLoading}
        >
          {isLoading ? <Spinner /> : 'Create'}
        </Button>
      </HStack>

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
