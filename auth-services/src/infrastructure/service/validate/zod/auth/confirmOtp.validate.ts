import z from "zod";
import ZodValidate from "../zod.validate.js";

const SendOtpValidation = z.object({
    email:z.string().email(),
    otp:z.string().length(6)
})

export default new ZodValidate(SendOtpValidation)
