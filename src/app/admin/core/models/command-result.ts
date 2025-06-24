import { ValidationError } from "./validation-error";

export interface CommandResult<T> {
  Data: T | null;
  IsValid: boolean;
  Erros: ValidationError[];
}