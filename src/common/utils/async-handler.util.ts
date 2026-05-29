/**
 * Utility to gracefully handle Promises without try-catch blocks.
 * Inspired by await-to-js.
 */
export async function asyncHandler<T, E = Error>(
  promise: Promise<T>,
): Promise<[E, null] | [null, T]> {
  try {
    const data = await promise;
    return [null, data];
  } catch (error) {
    return [error as E, null];
  }
}
