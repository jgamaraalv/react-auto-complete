import React, { useState, useRef, useEffect } from "react";

//@ts-ignore
import classes from "./autocomplete.module.css";
import { callAll, bodyClickHandler, keyDownHandler } from "./utils";
import { useAutocomplete, AutocompleteContext } from "./context";

type AutocompleteProps = React.HTMLAttributes<HTMLDivElement>;
function Autocomplete({ children, ...props }: AutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bodyClickListener = (event: MouseEvent) =>
      bodyClickHandler(event, containerRef, () => setOpen(false));
    const keyDownListener = (event: KeyboardEvent) =>
      keyDownHandler(event, () => setOpen(false));

    if (open) {
      document.body.addEventListener("click", bodyClickListener);
      document.body.addEventListener("keydown", keyDownListener);
    }

    return () => {
      if (open) {
        document.body.removeEventListener("click", bodyClickListener);
        document.body.removeEventListener("keydown", keyDownListener);
      }
    };
  }, [open]);

  return (
    <AutocompleteContext.Provider value={{ open, value, setValue, setOpen }}>
      <div
        className={classes["autocomplete__container"]}
        ref={containerRef}
        {...props}
      >
        {children}
      </div>
    </AutocompleteContext.Provider>
  );
}

type InputProps = React.HTMLAttributes<HTMLInputElement>;
function Input({ onFocus, onBlur, onChange, ...props }: InputProps) {
  const { value, setOpen, setValue } = useAutocomplete();

  function inputChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value.toLocaleLowerCase());
  }

  return (
    <input
      onFocus={callAll(() => setOpen(true), onFocus)}
      onChange={callAll(inputChangeHandler, onChange)}
      value={value}
      className={classes["input"]}
      {...props}
    />
  );
}

type ListItemProps = Omit<React.HTMLAttributes<HTMLLIElement>, "children"> & {
  value: string;
  children: string;
};
function ListItem({
  children,
  value,
  onMouseDown,
  onKeyDown,
  ...props
}: ListItemProps) {
  const { value: autocompleteValue, setOpen, setValue } = useAutocomplete();
  const valueRegex = new RegExp(`(${autocompleteValue})`, "gi");

  function setValueHandler() {
    setValue(value);
    setOpen(false);
  }

  function keyDownHandler(event: React.KeyboardEvent) {
    if (event.key === "Enter" || event.code === "Enter") {
      setValueHandler();
    }
  }

  const item = children.split(valueRegex).map((letter, idx) =>
    letter.toLocaleLowerCase() === autocompleteValue.toLocaleLowerCase() ? (
      <span
        key={`value-${letter}-${idx}`}
        className={classes["list__item__text--highlighted"]}
      >
        {letter}
      </span>
    ) : (
      letter
    )
  );

  return (
    <li
      onMouseDown={callAll(setValueHandler, onMouseDown)}
      onKeyDown={callAll(keyDownHandler, onKeyDown)}
      className={classes["list__item"]}
      tabIndex={0}
      {...props}
    >
      {item}
    </li>
  );
}

type ListProps = Omit<React.HTMLAttributes<HTMLUListElement>, "children"> & {
  children:
    | React.ReactElement<ListItemProps, typeof ListItem>
    | React.ReactElement<ListItemProps, typeof ListItem>[];
};
function List({ children, ...props }: ListProps) {
  const { open, value } = useAutocomplete();

  const listChildren = React.Children.map(children, (child) => {
    if (child.type !== ListItem) {
      throw new Error(
        "<Autocomplete.List> children must be an <Autocomplete.ListItem>"
      );
    }

    if (child.props.value.includes(value)) {
      return child;
    }

    return null;
  });

  return open ? (
    <ul className={classes["list"]} {...props}>
      {listChildren}
    </ul>
  ) : null;
}

Autocomplete.Input = Input;
Autocomplete.List = List;
Autocomplete.ListItem = ListItem;

export type { AutocompleteProps, InputProps, ListProps, ListItemProps };
export default Autocomplete;
