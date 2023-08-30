import {render, screen} from "@testing-library/react";
import {TextboxWithInfo} from "@/components/molecules/TextboxWithInfo/index";

test("it shows accessible things", () => {
  const title = "title";
  const description = "description";
  const error = "error";
  const args = {
    title: title, description: description, error: error
  }
  render(<TextboxWithInfo {...args} />)

  const textbox = screen.getByRole("textbox");
  expect(textbox).toHaveAccessibleName(title);
  expect(textbox).toHaveAccessibleDescription(description);
  expect(textbox).toHaveErrorMessage(error);
});