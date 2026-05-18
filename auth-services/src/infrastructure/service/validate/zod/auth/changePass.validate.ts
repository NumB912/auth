import z from "zod";
import ZodValidate from "../zod.validate.js";

const ChangePassValidate = z
  .object({
    password: z.string().min(6),
    email: z.email(),
    confirmPassword: z.string().min(6),
  })
  .refine(
    (data) => {
      return data.confirmPassword === data.password;
    },
    {
      message: "Password and confirm password must match",
      path: ["confirmPassword"],
    },
  );

export default new ZodValidate(ChangePassValidate);
