export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: Error };

export function successResult<T>(data: T): ActionResult<T> {
  return {
    success: true,
    data,
  };
}

export function errorResult<T>(error: Error | string): ActionResult<T> {
  return {
    success: false,
    error: typeof error === 'string' ? new Error(error) : error,
  };
}

