import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {mockUploadImage} from "@/services/client/UploadImage/__mock__/jest";
import {selectImageFile, setupMockServer} from "@/tests/jest";
import {composeStories} from "@storybook/testing-react";
import * as stories from "./index.stories"
import * as MyPosts from "@/services/client/MyPosts/__mock__/msw";
import * as MyProfile from "@/services/client/MyProfile/__mock__/msw";
import mockRouter from "next-router-mock";

const { Default } = composeStories(stories)
const user = userEvent.setup();

setupMockServer(...MyPosts.handlers, ...MyProfile.handlers);
beforeEach(() => {
  mockUploadImage();
  mockRouter.setCurrentUrl("/my/posts/create");
})

const setup = () => {
  render(<Default />);
  const toggleStatus = async () => {
    await user.click(screen.getByRole("switch", { name: "公開ステータス" }));
  };
  const saveAsPublish = async () => {
    await user.click(screen.getByRole("button", { name: "記事を公開する" }));
    await user.click(screen.getByRole("button", { name: "はい" }));
  }
  const saveAsDraft = async () => {
    await user.click(screen.getByRole("button", { name: "下書き保存する" }));
  }
  const { selectImage } = selectImageFile();
  const typeTitle = async (title: string) => {
    await user.type(screen.getByRole("textbox", { name: "記事タイトル" }), title);
  };

  return { toggleStatus, saveAsPublish, saveAsDraft, selectImage, typeTitle };
};

test("When you click the save button, the confirm dialog shows", async () => {
  const { toggleStatus } = setup();

  await toggleStatus();
  await user.click(screen.getByRole("button", { name: "記事を公開する" }));

  expect(screen.getByText("記事を公開します。よろしいですか？")).toBeInTheDocument()
});

test("When you submit the form with valid values, the confirm dialog shows", async () => {
  const { toggleStatus, typeTitle, selectImage, saveAsPublish } = setup();

  await toggleStatus();
  await typeTitle("title");
  await selectImage();
  await saveAsPublish();

  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent("保存中…")
  );
});

test("When you submit the form with valid values and complete, the succeed dialog shows", async () => {
  const { toggleStatus, typeTitle, selectImage, saveAsPublish } = setup();

  await toggleStatus();
  await typeTitle("title")
  await selectImage();
  await saveAsPublish();

  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent("公開に成功しました")
  );
});

test("When you save the form with valid values and complete, the succeed dialog shows", async () => {
  const { typeTitle, selectImage, saveAsDraft } = setup();

  await typeTitle("title")
  await selectImage();
  await saveAsDraft();

  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent("保存に成功しました")
  );
});

test("When you save the form with valid values and complete, you move the created post page", async () => {
  const { typeTitle, selectImage, saveAsDraft } = setup();

  await typeTitle("200")
  await selectImage();
  await saveAsDraft();

  await waitFor(() =>
    expect(mockRouter).toMatchObject({ pathname: "/my/posts/200"})
  );
});

test("When the saving fail, the failed dialog shows", async () => {
  const { typeTitle, selectImage, saveAsDraft } = setup();

  await typeTitle("500")
  await selectImage();
  await saveAsDraft();

  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent("保存に失敗しました")
  );
});
