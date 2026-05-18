import type {
  Ivalidate,
  IValidationResult,
} from "@domain/validate/validate.entities.js";
import type z from "zod";

export default class ZodValidate<T> implements Ivalidate<T> {
  private schema: z.ZodSchema<T>;
  constructor(schema: z.ZodSchema<T>) {
    this.schema = schema;
  }
  public validate(data: T): IValidationResult<T> {
    const result = this.schema.safeParse(data);
    const IsSuccess = result.success;

    if (!IsSuccess) {
      const errors = result.error?.issues.map((issue) => {
        return `${issue.path.join(".")}: ${issue.message}`;
      });

      return {
        data: undefined,
        errors: errors,
        IsSuccess: false,
      } as IValidationResult<T>;
    }

    return {
      data: result.data,
      errors: undefined,
      isSuccess: IsSuccess,
    } as IValidationResult<T>;
  }
}
