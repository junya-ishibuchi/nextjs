import {OrderBy} from "@/components/templates/Posts/Header/OrderBy/index";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";

const user = userEvent.setup();

const setup = () => {
  render(<OrderBy/>);
  return screen.getByRole("combobox");
}

test("default value is 更新日時順", () => {
  const list = setup();
  expect(list).toHaveDisplayValue("更新日時順");
});

test("If you change a option, query is going to change the value you choose", async () => {
  const list = setup();
  await user.selectOptions(list, "スター数順");
  expect(mockRouter).toMatchObject({ query: { orderBy: "starCount" } });
});