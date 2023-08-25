import {render, screen} from "@testing-library/react";
import {Nav} from "@/components/layouts/BasicLayout/Header/Nav/index";
import mockRouter from "next-router-mock";
import userEvent from "@testing-library/user-event";

const user =userEvent.setup();

test("can move to a post lists page and it's current", async () => {
  mockRouter.setCurrentUrl('/');
  render(<Nav onCloseMenu={()=>{}} />);
  const link = screen.getByRole("link", { name: "My Posts" });
  expect(link).not.toHaveAttribute("aria-current", "page");

  await user.click(link);

  expect(mockRouter).toMatchObject({ pathname: "/my/posts" });
  expect(link).toHaveAttribute("aria-current", "page");
});

test("can move to a creating post page and it's current", async () => {
  mockRouter.setCurrentUrl('/');
  render(<Nav onCloseMenu={()=>{}} />);
  const link = screen.getByRole("link", { name: "Create Post" });
  expect(link).not.toHaveAttribute("aria-current", "page");

  await user.click(link);

  expect(mockRouter).toMatchObject({ pathname: "/my/posts/create" });
  expect(link).toHaveAttribute("aria-current", "page");
});

test("when you click the close button, the close method is going to be called", async () => {
  const onCloseMenu = jest.fn();
  render(<Nav onCloseMenu={onCloseMenu} />);

  await user.click(screen.getByRole("button"));

  expect(onCloseMenu).toBeCalled();
});
