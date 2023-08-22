import {render, screen} from "@testing-library/react";
import {SelectFilterOption} from "@/components/molecules/SelectFilterOption/index";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();

const setup = () => {
  const title = "title";
  const options = [
    {value: "public", label: "public"},
    {value: "private", label: "private"},
  ];
  render(<SelectFilterOption title={title} selectProps={{ name: "status" }} options={options} />);
  const combobox = screen.getByRole("combobox")
  return { title, options, combobox };
}

test("This select has an accessible name", () => {
  const { title, combobox } = setup();
  expect(combobox).toHaveAccessibleName(title);
});

test("You can change an option", async () => {
  const { options, combobox } = setup();
  await user.selectOptions(combobox, options[0].value);
  expect(combobox).toHaveDisplayValue(options[0].value);
});