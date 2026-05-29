import { ValidationError } from 'class-validator';

export interface ValidationErrorResponse {
  field: string;
  errors: string[];
}

/**
 * Recursively formats class-validator ValidationErrors into a clean, flat list of fields and constraints.
 */
export function formatValidationErrors(
  errors: ValidationError[],
  parentField = '',
): ValidationErrorResponse[] {
  const formattedErrors: ValidationErrorResponse[] = [];

  for (const error of errors) {
    const field = parentField
      ? `${parentField}.${error.property}`
      : error.property;

    if (error.constraints) {
      formattedErrors.push({
        field,
        errors: Object.values(error.constraints),
      });
    }

    if (error.children && error.children.length > 0) {
      formattedErrors.push(...formatValidationErrors(error.children, field));
    }
  }

  return formattedErrors;
}
