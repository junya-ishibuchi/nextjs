import {Combobox} from "@/components/molecules/Combobox/index";
import {render, screen} from "@testing-library/react";

test("It's a combobox", () => {
  render(<Combobox />);
  expect(screen.getByRole("combobox")).toBeInTheDocument();
});