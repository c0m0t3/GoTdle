import * as scoreSchema from './score.schema';
import * as userSchema from './user.schema';
import * as characterSchema from './character.schema';

export const databaseSchema = {
  ...userSchema,
  ...scoreSchema,
  ...characterSchema,
};
