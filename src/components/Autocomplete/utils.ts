export const callAll =
  (...fns: (((...args: any[]) => void) | undefined)[]) =>
  (...args: any[]) =>
    fns.forEach((fn) => fn?.(...args));

export function bodyClickHandler(
  event: MouseEvent,
  elementRef: React.RefObject<HTMLDivElement>,
  cbFn: () => void
) {
  let element = event.target as HTMLElement | null;

  while (element) {
    if (element === elementRef.current) {
      return;
    }

    element = element.parentElement;
  }

  cbFn();
}

export function keyDownHandler(event: KeyboardEvent, cbFn: () => void) {
  if (event.code === "Escape" || event.key === "Escape") {
    cbFn();
  }
}

export function throttle(
  fn: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>,
  time: number
) {
  let setTimeoutId: NodeJS.Timeout | null;

  return function () {
    if (setTimeoutId) {
      return;
    }

    setTimeoutId = setTimeout(() => {
      //@ts-ignore
      fn.apply(this, arguments);
      setTimeoutId = null;
    }, time);
  };
}
