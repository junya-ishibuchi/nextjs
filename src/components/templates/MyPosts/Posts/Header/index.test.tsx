import userEvent from "@testing-library/user-event";
import {render, screen} from "@testing-library/react";
import {Header} from "@/components/templates/MyPosts/Posts/Header/index";
import mockRouter from "next-router-mock";

const user = userEvent.setup();

test.each([
  { value: "all", label: "すべて" },
  { value: "public", label: "公開" },
  { value: "private", label: "下書き" }
])("When you select $value, a query is going to be changed", async (option) => {
  render(<Header />);
  await user.selectOptions(screen.getByRole("combobox"), option.value);

  expect(mockRouter).toMatchObject({ query: { status: option.value }});
});