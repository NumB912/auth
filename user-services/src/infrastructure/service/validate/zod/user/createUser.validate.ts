import { z } from "zod";
import ZodValidate from "../../../zod.validate.js";
const createUserValidate = z
  .object({
    auth_id:z.string(),
    firstName: z.string().min(2).max(100),
    lastName: z.string().min(2).max(100),
  })

export default new ZodValidate(createUserValidate);
