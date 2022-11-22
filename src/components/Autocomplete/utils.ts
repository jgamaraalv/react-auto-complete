export const callAll =
  (...fns: (((...args: any[]) => void) | undefined)[]) =>
  (...args: any[]) =>
    fns.forEach((fn) => fn?.(...args));

export const bodyClickHandler = (
  event: MouseEvent,
  elementRef: React.RefObject<HTMLDivElement>,
  cbFn: () => void
) => {
  let element = event.target as HTMLElement | null;

  while (element) {
    if (element === elementRef.current) {
      return;
    }

    element = element.parentElement;
  }

  cbFn();
};

export const keyDownHandler = (event: KeyboardEvent, cbFn: () => void) => {
  if (event.code === "Escape" || event.key === "Escape") {
    cbFn();
  }
};
