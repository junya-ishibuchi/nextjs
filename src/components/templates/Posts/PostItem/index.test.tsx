import {PostItem} from "@/components/templates/Posts/PostItem/index";
import {getPostsData} from "@/services/server/Posts/__mock__/fixture";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";

const user = userEvent.setup();

const setup =  () => {
  const post = getPostsData.posts[0];
  render(<PostItem post={post} />);
  const link = screen.getByRole('link');
  const click = () => user.click(link);

  return { post, link, click }
}

test("An accessible name is the title of the input post", () => {
  const { post, link } = setup();
  expect(link).toHaveAccessibleName(post.title);
});

test("when you click the link, you can move to the link", async () => {
  const { post, click } = setup();
  await click();
  expect(mockRouter).toMatchObject({ pathname: `/posts/${post.id}` });
});