import { ApiError } from '../api';
import { errorMessage } from '../helpers';


export const handleQueryError = (error: unknown) => {
  console.log(typeof error, error);

  if (error instanceof ApiError) {
    errorMessage(error.message);
    return;
  }
  errorMessage('unexpected error');
};