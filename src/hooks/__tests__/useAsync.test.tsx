import { renderHook, act } from "@testing-library/react-hooks";

import { useAsync, UseAsyncState } from "../useAsync";

beforeEach(() => {
  jest.spyOn(console, "error");
});

afterEach(() => {
  // eslint-disable-next-line
  (console.error as jest.Mock).mockRestore;
});

function deferred() {
  let resolve: ((value?: unknown) => void) | (() => null) = () => null;
  let reject: ((reason?: any) => void) | (() => null) = () => null;
  // eslint-disable-next-line promise/param-names
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const defaultState = {
  status: undefined,
  data: undefined,
  error: undefined,

  isIdle: true,
  isLoading: false,
  isError: false,
  isSuccess: false,

  run: expect.any(Function),
  reset: expect.any(Function),
  setData: expect.any(Function),
  setError: expect.any(Function),
};

const loadingState = {
  ...defaultState,
  status: "loading",
  isIdle: false,
  isLoading: true,
};

const loadedState = {
  ...defaultState,
  status: "loaded",
  isIdle: false,
  isSuccess: true,
};

const errorState = {
  ...defaultState,
  status: "error",
  isIdle: false,
  isError: true,
};

test("calling run with a promise which resolves", async () => {
  const { promise, resolve } = deferred();
  const { result } = renderHook(() => useAsync());
  expect(result.current).toEqual(defaultState);
  let p: Promise<unknown>;
  act(() => {
    p = result.current.run(promise);
  });
  expect(result.current).toEqual(loadingState);
  const loadedValue = Symbol("loaded value");
  await act(async () => {
    resolve(loadedValue);
    await p;
  });
  expect(result.current).toEqual({
    ...loadedState,
    data: loadedValue,
  });

  act(() => {
    result.current.reset();
  });
  expect(result.current).toEqual(defaultState);
});

test("calling run with a promise which rejects", async () => {
  const { promise, reject } = deferred();
  const { result } = renderHook(() => useAsync());
  expect(result.current).toEqual(defaultState);
  let p: Promise<unknown>;
  act(() => {
    p = result.current.run(promise);
  });
  expect(result.current).toEqual(loadingState);
  const errorValue = Symbol("error value");
  await act(async () => {
    reject(errorValue);
    await p.catch(() => {
      /* ignore erorr */
    });
  });
  expect(result.current).toEqual({ ...errorState, error: errorValue });
});

test("can specify an initial state", () => {
  const mockData = Symbol("loaded value");
  const customInitialState = {
    status: "loaded",
    data: mockData,
    error: undefined,
  };
  const { result } = renderHook(() =>
    useAsync(customInitialState as UseAsyncState<typeof mockData>)
  );
  expect(result.current).toEqual({
    ...loadedState,
    ...customInitialState,
  });
});

test("can set the data", () => {
  const mockData = Symbol("loaded value");
  const { result } = renderHook(() => useAsync());
  act(() => {
    result.current.setData(mockData);
  });
  expect(result.current).toEqual({
    ...loadedState,
    data: mockData,
  });
});

test("can set the error", () => {
  const mockError = new Error("error value");
  const { result } = renderHook(() => useAsync());
  act(() => {
    result.current.setError(mockError);
  });
  expect(result.current).toEqual({
    ...errorState,
    error: mockError,
  });
});

test("No state updates happen if the component is unmounted while loading", async () => {
  const { promise, resolve } = deferred();
  const { result, unmount } = renderHook(() => useAsync());
  let p: Promise<unknown>;
  act(() => {
    p = result.current.run(promise);
  });
  unmount();
  await act(async () => {
    resolve();
    await p;
  });
  // eslint-disable-next-line
  expect(console.error).not.toHaveBeenCalled();
});

test('calling "run" without a promise results in an early error', () => {
  const { result } = renderHook(() => useAsync());
  void expect(
    async () =>
      await result.current.run(jest.fn() as unknown as Promise<unknown>)
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    '"The argument passed to useAsync().run must be a promise."'
  );
});
