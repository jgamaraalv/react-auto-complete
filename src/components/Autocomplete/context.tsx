import { createContext, useState, useCallback, useContext } from "react";

interface AutocompleteContextProps {
  open: boolean;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AutocompleteContext =
  createContext<AutocompleteContextProps | null>(null);

export function useAutocomplete() {
  const context = useContext(AutocompleteContext);

  if (!context) {
    throw new Error("This component must be used within <Autocomplete/>");
  }

  return context;
}
