import userEvent from "@testing-library/user-event";
import {render, screen} from "@testing-library/react";
import {Header} from "@/components/templates/MyPosts/Posts/Header/index";
import mockRouter from "next-router-mock";

const user = userEvent.setup();

test.each([
  { value: "all", label: "すべて" },
  { value: "public", label: "公開" },
  { value: "private", label: "下書き" }
])("When a url has status query '$value', an option display '$value'", (option) => {
  mockRouter.setCurrentUrl(`my/posts?status=${option.value}`)
  render(<Header />);

  expect(screen.getByRole("combobox")).toHaveDisplayValue(option.label);
});

test("default status is 'すべて'", () => {
  mockRouter.setCurrentUrl('my/posts');

  render(<Header />);

  expect(screen.getByRole("combobox")).toHaveDisplayValue("すべて");
})

test.each([
  { value: "all", label: "すべて" },
  { value: "public", label: "公開" },
  { value: "private", label: "下書き" }
])("When you select $value, a query is going to be changed", async (option) => {
  render(<Header />);
  await user.selectOptions(screen.getByRole("combobox"), option.label);

  expect(mockRouter).toMatchObject({ query: { status: option.value }});
});

test("When you select $value, the originally set query is not deleted.", async () => {
  mockRouter.setCurrentUrl(`my/posts?page=1`)
  render(<Header />);

  await user.selectOptions(screen.getByRole("combobox"), "すべて");
  expect(mockRouter).toMatchObject({ query: { status: "all", page: "1" }});

  await user.selectOptions(screen.getByRole("combobox"), "公開");
  expect(mockRouter).toMatchObject({ query: { status: "public", page: "1" }});
});
