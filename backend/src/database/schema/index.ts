import { scoreSchema } from './score.schema';
import { userSchema } from './user.schema';
import { characterSchema } from './character.schema';

export const databaseSchema = {
  ...userSchema,
  ...scoreSchema,
  ...characterSchema,
};
