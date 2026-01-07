
"use client";

import { useState, useCallback } from "react";
import { ActionResult } from "@/lib/core/errors/result";
import { handleError, toError } from "@/lib/core/errors/handlers";

interface UseActionOptions<T> {
	onSuccess?: (data: T) => void;
	onError?: (error: Error) => void;
}

export function useAction<T = unknown>(options: UseActionOptions<T> = {}) {
	const [error, setError] = useState<Error | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const execute = useCallback(
		async (actionFn: () => Promise<ActionResult<T>>) => {
			setIsLoading(true);
			setError(null);

			try {
				const result = await actionFn();

				if (result.success) {
					setError(null);
					setIsLoading(false);
					options.onSuccess?.(result.data);
				} else {
					setError(result.error);
					setIsLoading(false);
					options.onError?.(result.error);
				}

				return result;
			} catch (error) {
				const appError = handleError(toError(error));
				setError(appError);
				setIsLoading(false);
				options.onError?.(appError);

				return {
					success: false as const,
					error: appError,
				};
			}
		},
		[options]
	);

	return {
		error,
		isLoading,
		execute,
	};
}
