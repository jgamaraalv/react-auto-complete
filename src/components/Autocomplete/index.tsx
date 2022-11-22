import React, { useState, useRef, useEffect } from "react";

//@ts-ignore
import classes from "./index.module.css";
import { callAll, bodyClickHandler, keyDownHandler, throttle } from "./utils";
import usePrevious from "../../hooks/usePrevious";
import { useAutocomplete, AutocompleteContext } from "./context";

type ContainerProps = React.HTMLAttributes<HTMLDivElement>;
function Container({ children, ...props }: ContainerProps) {
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
    setValue(event.target.value);
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

type ListItemProps = Omit<
  React.HTMLAttributes<HTMLLIElement>,
  "children" | "onClick"
> & {
  value: string;
  children: string;
  onClick?: (value: string) => void;
};
function ListItem({
  children,
  value,
  onClick,
  onKeyDown,
  ...props
}: ListItemProps) {
  const { value: autocompleteValue, setOpen, setValue } = useAutocomplete();
  const valueRegex = new RegExp(
    `(${autocompleteValue.toLocaleLowerCase()})`,
    "i"
  );

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
      onClick={callAll(setValueHandler, () => onClick && onClick(value))}
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

    if (
      child.props.children
        .toLocaleLowerCase()
        .includes(value.toLocaleLowerCase())
    ) {
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

interface AutocompleteProps {
  options?: { name: string; value: string; id: number }[];
  onSearch?: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onOptionSelected?: ListItemProps["onClick"];
}
function Autocomplete({
  options = [],
  onSearch,
  onOptionSelected,
}: AutocompleteProps) {
  const [suggestedOptions, setSuggestedOptions] = useState(() => options);
  const previousSuggestedOptions = usePrevious(suggestedOptions);

  useEffect(() => {
    if (
      JSON.stringify(previousSuggestedOptions) !==
        JSON.stringify(suggestedOptions) ||
      suggestedOptions.length === 0
    ) {
      setSuggestedOptions(options);
    }
  }, [suggestedOptions, options, previousSuggestedOptions]);

  return (
    <Container>
      <Input
        placeholder="Enter a product's name"
        onChange={onSearch && throttle(onSearch, 500)}
      />

      <List>
        {suggestedOptions.map((option) => (
          <ListItem
            key={`option-${option.id}`}
            value={option.value}
            onClick={onOptionSelected && onOptionSelected}
          >
            {option.name}
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

Container.Input = Input;
Container.List = List;
Container.ListItem = ListItem;

export type {
  ContainerProps,
  InputProps,
  ListProps,
  ListItemProps,
  AutocompleteProps,
};
export { Container as Autocomplete };
export default Autocomplete;
