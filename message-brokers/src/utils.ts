export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error;
  if (error instanceof Error && typeof error.message === 'string')
    return error.message;
  return 'Unknown error';
};
