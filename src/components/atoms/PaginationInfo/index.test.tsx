import {render, screen} from "@testing-library/react";
import {PaginationInfo} from "@/components/atoms/PaginationInfo/index";

test("It has an accessible name", () => {
  render(<PaginationInfo start={1} end={9} hitCount={3} />);
  expect(screen.getByRole("region")).toHaveAccessibleName("現在表示中の一覧概要");
})