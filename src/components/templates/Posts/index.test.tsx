import {render, screen} from "@testing-library/react";
import {Posts} from "@/components/templates/Posts/index";
import {getPostsData} from "@/services/server/Posts/__mock__/fixture";

test("can render and it has an accessible name", () => {
  render(<Posts {...getPostsData}/>);
  expect(screen.getByRole("banner")).toBeInTheDocument();
  expect(screen.getByRole("region", { name: "記事一覧" })).toBeInTheDocument();
  expect(screen.getByRole("navigation")).toBeInTheDocument();
  expect(screen.getByRole("region", { name: "現在表示中の一覧概要"})).toBeInTheDocument();
  expect(screen.getByRole("region", { name: "最新投稿一覧" })).toHaveAccessibleName("最新投稿一覧");
});