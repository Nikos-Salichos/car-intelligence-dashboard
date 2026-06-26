// English Comment: Generic helper function to retry an asynchronous operation up to a specified number of times if it fails
export const withRetry = async <T>(fn: () => Promise<T>, retries: number = 10): Promise<T> => {
  let lastError: unknown;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      // English Comment: If it's the last attempt, break out of the loop and throw the final captured error
      if (attempt === retries) break;
    }
  }
  throw lastError;
};
