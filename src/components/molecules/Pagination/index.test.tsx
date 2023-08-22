import userEvent from "@testing-library/user-event";
import {render, screen} from "@testing-library/react";
import {Pagination} from "@/components/molecules/Pagination/index";
import {generatePagination} from "@/lib/util/pagination";
import mockRouter from "next-router-mock";

const user = userEvent.setup();
const setUp = () => {
  render(<Pagination pathname={"/"} pagination={generatePagination(1, 100)} />);
  const navigation = screen.getByRole("navigation");
  return { navigation };
}

test("This navigation has an accessible name", () => {
  const { navigation } = setUp();
  expect(navigation).toHaveAccessibleName("ページネーション");
});

test("If the page doesn't have a pagination, nothing show up", () => {
  render(<Pagination pathname={"/"} pagination={generatePagination(0, 0)} />);
  expect(screen.queryByRole("navigation")).toBe(null);
});
test("When you click link, you move to the location", async () => {
  mockRouter.setCurrentUrl("/?page=0");
  setUp();
  await user.click(screen.getByRole("link", { name: "2" }));
  expect(mockRouter.query).toMatchObject({ "page": "2" })
});

test("When you're in a current page, the link has current state", () => {
  mockRouter.setCurrentUrl("/?page=0");
  setUp();
  expect(screen.getByRole("link", { name: "1" })).toHaveAttribute("aria-current", "page");
  expect(screen.getByRole("link", { name: "2" })).not.toHaveAttribute("aria-current", "page");
});
