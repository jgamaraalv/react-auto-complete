import React, { useState } from "react";
import { screen, render } from "@testing-library/react";

import { Autocomplete } from "../../../components/Autocomplete";

jest.mock("react", () => ({
  ...(jest.requireActual("react") as typeof React),
  useState: jest.fn(),
}));

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
});
