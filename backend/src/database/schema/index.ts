import { scoreSchema } from "./score.schema";
import { userSchema } from "./user.schema";

export const databaseSchema = {
  ...userSchema,
  ...scoreSchema,
};
