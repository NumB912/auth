import z from "zod";
import ZodValidate from "../zod.validate.js";

const SendOtpValidation = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
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

export default new ZodValidate(SendOtpValidation);
