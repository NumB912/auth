import { z } from "zod";
import ZodValidate from "../../../zod.validate.js";

const updateUserSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  })

export default new ZodValidate(updateUserSchema);
