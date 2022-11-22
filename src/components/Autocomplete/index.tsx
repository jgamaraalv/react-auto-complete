import React, { useState, useCallback } from "react";

import { useAutocomplete, AutocompleteContext } from "./context";

type AutocompleteProps = React.HTMLAttributes<HTMLDivElement>;
function Autocomplete({ children, ...props }: AutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const toggle = useCallback(() => setOpen((state) => !state), []);

  return (
    <AutocompleteContext.Provider value={{ open, toggle, value, setValue }}>
      <div {...props}>{children}</div>
    </AutocompleteContext.Provider>
  );
}

type InputProps = React.HTMLAttributes<HTMLInputElement>;
function Input({ onFocus, onBlur, onChange, ...props }: InputProps) {
  const { value, toggle, setValue } = useAutocomplete();

  function inputChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
  }

  return (
    <input
      onFocus={(event) => {
        toggle();
        onFocus?.(event);
      }}
      onBlur={(event) => {
        toggle();
        onBlur?.(event);
      }}
      onChange={(event) => {
        inputChangeHandler(event);
        onChange?.(event);
      }}
      value={value}
      {...props}
    />
  );
}

type ListItemProps = React.HTMLAttributes<HTMLLIElement> & {
  value: string;
};
function ListItem({ children, value, onMouseDown, ...props }: ListItemProps) {
  const { setValue } = useAutocomplete();

  return (
    <li
      onMouseDown={(event) => {
        setValue(value);
        onMouseDown?.(event);
      }}
      {...props}
    >
      {children}
    </li>
  );
}

type ListProps = Omit<React.HTMLAttributes<HTMLUListElement>, "children"> & {
  children: React.ReactElement<ListItemProps, typeof ListItem>;
};
function List({ children, ...props }: ListProps) {
  const { open, value } = useAutocomplete();

  return open ? (
    <ul {...props}>
      {React.Children.map(children, (child) => {
        if (child.type !== ListItem) {
          throw new Error(
            "<Autocomplete.List> children must be an <Autocomplete.ListItem>"
          );
        }

        if (child.props.value.includes(value)) {
          return child;
        }

        return null;
      })}
    </ul>
  ) : null;
}

Autocomplete.Input = Input;
Autocomplete.List = List;
Autocomplete.ListItem = ListItem;

export type { AutocompleteProps, InputProps, ListProps, ListItemProps };
export default Autocomplete;
