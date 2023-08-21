import {PostItem} from "@/components/templates/Posts/PostItem/index";
import {getPostsData} from "@/services/server/Posts/__mock__/fixture";
import {getByRole, render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";

test("when you click the link, you can move to the link", async () => {
  render(<PostItem post={getPostsData.posts[0]} />);
  const link = screen.getByRole('link');
  await userEvent.click(link);
  expect(mockRouter).toMatchObject({pathname: '/posts/1'});
});