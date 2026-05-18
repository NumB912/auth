import z from "zod";
import ZodValidate from "../zod.validate.js";

const SendOtpValidation = z.object({
    email:z.string().email()
})

export default new ZodValidate(SendOtpValidation)
