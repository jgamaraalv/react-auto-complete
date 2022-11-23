import React, { useState } from "react";
import { screen, render, fireEvent } from "@testing-library/react";

import CompoundedAutocomplete, {
  Autocomplete,
} from "../../../components/Autocomplete";
import {
  AutocompleteContext,
  AutocompleteContextProps,
} from "../../../components/Autocomplete/context";

jest.mock("react", () => ({
  ...(jest.requireActual("react") as typeof React),
  useState: jest.fn(),
}));

const CONTEXT_INITIAL_VALUES: AutocompleteContextProps = {
  open: false,
  value: "",
  setValue: jest.fn(),
  setOpen: jest.fn(),
};

const mockedOptions = [
  { name: "Value 1", value: "Value 1", id: 1 },
  { name: "Value 2", value: "Value 2", id: 2 },
  { name: "Value 3", value: "Value 3", id: 3 },
];

describe("<Autocomplete/>", () => {
  describe("<Container/>", () => {
    const addEventListenerSpy = jest.spyOn(document.body, "addEventListener");
    const removeEventListener = jest.spyOn(
      document.body,
      "removeEventListener"
    );

    it("mounts correctly when open state is equal false", () => {
      (useState as jest.Mock)
        .mockReturnValueOnce([false, () => console.log("setOpen")])
        .mockReturnValueOnce(["", () => console.log("setValue")]);
      const { container } = render(<Autocomplete>children</Autocomplete>);

      expect(addEventListenerSpy).not.toHaveBeenCalled();
      expect(removeEventListener).not.toHaveBeenCalled();
      expect(
        container.getElementsByClassName("autocomplete__container")[0]
      ).toBeInTheDocument();
      expect(screen.getByText("children")).toBeInTheDocument();
    });

    it("unmounts correctly when open state is equal false", () => {
      (useState as jest.Mock)
        .mockReturnValueOnce([false, () => console.log("setOpen")])
        .mockReturnValueOnce(["", () => console.log("setValue")]);
      const { unmount } = render(<Autocomplete>children</Autocomplete>);

      unmount();
      expect(removeEventListener).not.toHaveBeenCalled();
    });

    it("mounts correctly when open state is equal true", () => {
      (useState as jest.Mock)
        .mockReturnValueOnce([true, () => console.log("setOpen")])
        .mockReturnValueOnce(["", () => console.log("setValue")]);
      const { container } = render(<Autocomplete>children</Autocomplete>);

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "click",
        expect.any(Function)
      );
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function)
      );
      expect(removeEventListener).not.toHaveBeenCalled();
      expect(
        container.getElementsByClassName("autocomplete__container")[0]
      ).toBeInTheDocument();
      expect(screen.getByText("children")).toBeInTheDocument();
    });

    it("unmounts correctly when open state is equal true", () => {
      (useState as jest.Mock)
        .mockReturnValueOnce([true, () => console.log("setOpen")])
        .mockReturnValueOnce(["", () => console.log("setValue")]);
      const { unmount } = render(<Autocomplete>children</Autocomplete>);

      unmount();
      expect(removeEventListener).toHaveBeenCalledWith(
        "click",
        expect.any(Function)
      );
      expect(removeEventListener).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function)
      );
    });
  });

  describe("<Input/>", () => {
    it("throws an error if doesn't have <Autocomplete/> parent", () => {
      try {
        render(<Autocomplete.Input />);
      } catch (err: any) {
        expect(err.message).toBe(
          "This component must be used within <Autocomplete/>"
        );
      }
    });

    it("renders correctly", () => {
      const { container } = render(
        <AutocompleteContext.Provider value={CONTEXT_INITIAL_VALUES}>
          <Autocomplete.Input />
        </AutocompleteContext.Provider>
      );

      expect(screen.getByRole("textbox")).toBeInTheDocument();
      expect(container.getElementsByClassName("input")[0]).toBeInTheDocument();
    });

    it("opens list when focused", () => {
      const mockedSetOpen = jest.fn();
      const { container } = render(
        <AutocompleteContext.Provider
          value={{ ...CONTEXT_INITIAL_VALUES, setOpen: mockedSetOpen }}
        >
          <Autocomplete.Input />
        </AutocompleteContext.Provider>
      );

      expect(screen.getByRole("textbox")).toBeInTheDocument();
      expect(container.getElementsByClassName("input")[0]).toBeInTheDocument();
      fireEvent.focus(screen.getByRole("textbox"));
      expect(mockedSetOpen).toBeCalledWith(true);
    });

    it("changes input value", () => {
      const mockedSetValue = jest.fn();
      render(
        <AutocompleteContext.Provider
          value={{ ...CONTEXT_INITIAL_VALUES, setValue: mockedSetValue }}
        >
          <Autocomplete.Input />
        </AutocompleteContext.Provider>
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "test" } });
      expect(mockedSetValue).toHaveBeenCalledWith("test");
    });
  });

  describe("<List/>", () => {
    it("throws an error if doesn't have <Autocomplete/> parent", () => {
      try {
        render(
          <Autocomplete.List>
            <Autocomplete.ListItem value="value">Value</Autocomplete.ListItem>
          </Autocomplete.List>
        );
      } catch (err: any) {
        expect(err.message).toBe(
          "This component must be used within <Autocomplete/>"
        );
      }
    });

    it("throws an error if has a child other than <ListItem/> ", () => {
      try {
        render(
          <AutocompleteContext.Provider value={CONTEXT_INITIAL_VALUES}>
            <Autocomplete.List>
              <div></div>
            </Autocomplete.List>
          </AutocompleteContext.Provider>
        );
      } catch (err: any) {
        expect(err.message).toBe(
          "<Autocomplete.List> children must be an <Autocomplete.ListItem>"
        );
      }
    });

    it("renders correctly when open is equal false", () => {
      const { container } = render(
        <AutocompleteContext.Provider
          value={{ ...CONTEXT_INITIAL_VALUES, open: false }}
        >
          <Autocomplete.List>
            <Autocomplete.ListItem value="value">Value</Autocomplete.ListItem>
            <Autocomplete.ListItem value="value2">
              Value 2
            </Autocomplete.ListItem>
          </Autocomplete.List>
        </AutocompleteContext.Provider>
      );

      expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
      expect(container.getElementsByClassName("list")[0]).toBe(undefined);
    });

    it("renders correctly when open is equal true", () => {
      const { container } = render(
        <AutocompleteContext.Provider
          value={{ ...CONTEXT_INITIAL_VALUES, open: true }}
        >
          <Autocomplete.List>
            <Autocomplete.ListItem value="value">Value</Autocomplete.ListItem>
            <Autocomplete.ListItem value="value2">
              Value 2
            </Autocomplete.ListItem>
          </Autocomplete.List>
        </AutocompleteContext.Provider>
      );

      expect(screen.queryAllByRole("listitem").length).toBe(2);
      expect(container.getElementsByClassName("list")[0]).toBeInTheDocument();
    });

    it("filters options by name with value", () => {
      render(
        <AutocompleteContext.Provider
          value={{ ...CONTEXT_INITIAL_VALUES, open: true, value: "value 2" }}
        >
          <Autocomplete.List>
            <Autocomplete.ListItem value="value">Value</Autocomplete.ListItem>
            <Autocomplete.ListItem value="value2">
              Value 2
            </Autocomplete.ListItem>
          </Autocomplete.List>
        </AutocompleteContext.Provider>
      );

      expect(screen.queryAllByRole("listitem").length).toBe(1);
      expect(screen.getByRole("listitem").innerHTML).toBe(
        '<span class="list__item__text--highlighted">Value 2</span>'
      );
    });
  });

  describe("<ListItem/>", () => {
    it("throws an error if doesn't have <Autocomplete/> parent", () => {
      try {
        render(
          <Autocomplete.ListItem value="value">Value</Autocomplete.ListItem>
        );
      } catch (err: any) {
        expect(err.message).toBe(
          "This component must be used within <Autocomplete/>"
        );
      }
    });

    it("renders correctly", () => {
      const { container } = render(
        <AutocompleteContext.Provider value={CONTEXT_INITIAL_VALUES}>
          <Autocomplete.ListItem value="value">Value</Autocomplete.ListItem>
        </AutocompleteContext.Provider>
      );

      expect(screen.getByRole("listitem")).toBeInTheDocument();
      expect(
        container.getElementsByClassName("list__item")[0]
      ).toBeInTheDocument();
    });

    it("renders correctly with text highlighted", () => {
      render(
        <AutocompleteContext.Provider
          value={{ ...CONTEXT_INITIAL_VALUES, value: "Val" }}
        >
          <Autocomplete.ListItem value="value">Value</Autocomplete.ListItem>
        </AutocompleteContext.Provider>
      );

      expect(screen.getByRole("listitem").innerHTML).toBe(
        '<span class="list__item__text--highlighted">Val</span>ue'
      );
    });

    it("selects value by clicking and close the list", () => {
      const mockedSetValue = jest.fn();
      const mockedSetOpen = jest.fn();
      render(
        <AutocompleteContext.Provider
          value={{
            ...CONTEXT_INITIAL_VALUES,
            setValue: mockedSetValue,
            setOpen: mockedSetOpen,
          }}
        >
          <Autocomplete.ListItem value="value">Value</Autocomplete.ListItem>
        </AutocompleteContext.Provider>
      );

      fireEvent.click(screen.getByRole("listitem"));
      expect(mockedSetValue).toBeCalledWith("value");
      expect(mockedSetOpen).toBeCalledWith(false);
    });
  });
});
