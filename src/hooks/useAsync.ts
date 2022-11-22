import React from "react";

type AsyncState<T = unknown, E extends Error = Error> =
  | (Partial<T> & {
      status?: "loading" | undefined;
      error?: undefined;
    })
  | (Partial<T> & {
      status: "error";
      error: E;
    })
  | (T & {
      status: "loaded";
      error?: undefined;
    });

type UseAsyncState<T> = AsyncState<{ data: T }>;

type PromiseType<T extends Promise<unknown>> = T extends Promise<infer R>
  ? R
  : never;

function useSafeDispatch<T>(dispatch: React.Dispatch<T>) {
  const mounted = React.useRef(false);

  React.useLayoutEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  return React.useCallback(
    (state: T) => (mounted.current ? dispatch(state) : undefined),
    [dispatch]
  );
}

const defaultInitialState = {
  status: undefined,
  data: undefined,
  error: undefined,
};

export function useAsync<T>(initialState?: UseAsyncState<T>) {
  const initialStateRef = React.useRef({
    ...defaultInitialState,
    ...initialState,
  });
  const [{ status, data: stateData, error: stateError }, setState] =
    React.useReducer<(prevState: any, nextState: any) => UseAsyncState<T>>(
      (prevState, nextState) => ({ ...prevState, ...nextState }),
      initialStateRef.current
    );

  const safeSetState = useSafeDispatch<UseAsyncState<T>>(setState);

  const setData = React.useCallback(
    (data: T) => safeSetState({ data, status: "loaded" }),
    [safeSetState]
  );
  const setError = React.useCallback(
    (error: Error) => safeSetState({ error, status: "error" }),
    [safeSetState]
  );
  const reset = React.useCallback(
    () => safeSetState(initialStateRef.current),
    [safeSetState]
  );

  const run = React.useCallback(
    async (promise: Promise<T>): Promise<T> => {
      if (promise === undefined || promise.then === undefined) {
        throw new Error(
          "The argument passed to useAsync().run must be a promise."
        );
      }
      safeSetState({ status: "loading", data: undefined });

      return await promise.then(
        (data: T) => {
          setData(data);
          return data;
        },
        async (error: Error) => {
          setError(error);
          return await Promise.reject(error);
        }
      );
    },
    [safeSetState, setData, setError]
  );

  return {
    isIdle: status === undefined,
    isLoading: status === "loading",
    isError: status === "error",
    isSuccess: status === "loaded",

    setData,
    setError,
    error: stateError,
    status,
    data: stateData,
    run,
    reset,
  };
}

export type { AsyncState, PromiseType, UseAsyncState };
export default useAsync;
