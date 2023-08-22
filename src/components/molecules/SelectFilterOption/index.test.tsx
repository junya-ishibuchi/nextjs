import {render, screen} from "@testing-library/react";
import {SelectFilterOption} from "@/components/molecules/SelectFilterOption/index";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();

const setup = () => {
  render(<SelectFilterOption title={"title"} selectProps={{ name: "status" }} options={[
    {value: "public", label: "public"},
    {value: "private", label: "private"},
  ]} />);
  const combobox = screen.getByRole("combobox")
  return { combobox };
}

test("This select has an accessible name", () => {
  const { combobox } = setup();
  expect(combobox).toHaveAccessibleName("title");
});

test("You can change an option", async () => {
  const { combobox } = setup();
  await user.selectOptions(combobox, "private");
  expect(combobox).toHaveDisplayValue("private");
});