export class CustomError extends Error {
  public status: number;
  public statusText: string;
  public details: any;

  constructor(message: string, status?: number, statusText?: string, details?: any) {
    super(message);
    this.name = 'CustomError';
    this.status = status || 500;
    this.statusText = statusText || 'Internal Server Error';
    this.details = details;

    // Capture the stack trace (useful for debugging)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}
