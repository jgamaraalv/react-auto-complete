import React, { useState, useCallback } from "react";

//@ts-ignore
import classes from "./autocomplete.module.css";
import { useAutocomplete, AutocompleteContext } from "./context";

const callAll =
  (...fns: (((...args: any[]) => void) | undefined)[]) =>
  (...args: any[]) =>
    fns.forEach((fn) => fn?.(...args));

type AutocompleteProps = React.HTMLAttributes<HTMLDivElement>;
function Autocomplete({ children, ...props }: AutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const toggle = useCallback(() => setOpen((state) => !state), []);

  return (
    <AutocompleteContext.Provider value={{ open, toggle, value, setValue }}>
      <div className={classes["autocomplete__container"]} {...props}>
        {children}
      </div>
    </AutocompleteContext.Provider>
  );
}

type InputProps = React.HTMLAttributes<HTMLInputElement>;
function Input({ onFocus, onBlur, onChange, ...props }: InputProps) {
  const { value, toggle, setValue } = useAutocomplete();

  function inputChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value.toLocaleLowerCase());
  }

  return (
    <input
      onFocus={callAll(toggle, onFocus)}
      onBlur={callAll(toggle, onBlur)}
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
function ListItem({ children, value, onMouseDown, ...props }: ListItemProps) {
  const { setValue, value: autocompleteValue } = useAutocomplete();
  const valueRegex = new RegExp(`(${autocompleteValue})`, "gi");

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
      onMouseDown={callAll(() => setValue(value), onMouseDown)}
      className={classes["list__item"]}
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
