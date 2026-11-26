import axios from "axios";

/**
 * Helper function for exhaustive type checking
 */
export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

interface ValidationIssue {
  path?: (string | number)[];
  message: string;
}

const isIssueList = (value: unknown): value is ValidationIssue[] =>
  Array.isArray(value) && value.every(item =>
    typeof item === "object" && item !== null && "message" in item
  );

/**
 * Turns an error thrown by axios (or anything else) into a readable message.
 * The backend answers validation errors with { error: string | ZodIssue[] }.
 */
export const errorMessage = (e: unknown): string => {
  if (axios.isAxiosError(e)) {
    const data: unknown = e.response?.data;
    if (typeof data === "string" && data.length > 0) {
      return data.replace("Something went wrong. Error: ", "");
    }
    if (data && typeof data === "object" && "error" in data) {
      if (typeof data.error === "string") {
        return data.error;
      }
      if (isIssueList(data.error)) {
        return data.error
          .map(issue => issue.path && issue.path.length > 0
            ? `${issue.path.join(".")}: ${issue.message}`
            : issue.message)
          .join("; ");
      }
    }
    return e.message;
  }
  if (e instanceof Error) {
    return e.message;
  }
  return "Unknown error";
};
