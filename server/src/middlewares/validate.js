import { Errors } from '../utils/error/error.js';

export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        issue: issue.message,
      }));
      return next(Errors.VALIDATION_FAILED(details));
    }
    req[source] = result.data;
    next();
  };
}