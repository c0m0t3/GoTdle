import { scoreSchema } from './score.schema';
import { userSchema } from './user.schema';
import * as characterSchema from './character.schema';

export const databaseSchema = {
  ...userSchema,
  ...scoreSchema,
  ...characterSchema,
};
