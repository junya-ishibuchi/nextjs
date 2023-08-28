import {render, screen} from "@testing-library/react";
import {PostForm} from "@/components/templates/MyPostsCreate/PostForm/index";
import userEvent from "@testing-library/user-event";
import {selectImageFile, setupMockServer} from "@/tests/jest";
import {mockUploadImage} from "@/services/client/UploadImage/__mock__/jest";
import {handleGetMyProfile} from "@/services/client/MyProfile/__mock__/msw";

const user =userEvent.setup();

setupMockServer(handleGetMyProfile());

const setUp = (title: string = "title") => {
  const onClickSave = jest.fn();
  const onInvalid = jest.fn();
  const onValid = jest.fn();
  render(<PostForm
      title={title}
      onClickSave={onClickSave}
      onValid={onValid}
      onInvalid={onInvalid}
    />
  );
  const typeTitle = async (title: string) => {
    await user.type(screen.getByRole("textbox", { name: "記事タイトル" }), title);
  }
  const clickSaveButton = async () => {
    await user.click(screen.getByRole("button", { name: "下書き保存する" }));
  }

  return { onClickSave, onInvalid, onValid, typeTitle, clickSaveButton };
};

test("The form has a label", () => {
  setUp();
  expect(screen.getByRole("form")).toHaveAccessibleName("title");
})

test("When you only input a title, a validation error occurs", async () => {
  const { onClickSave, onInvalid, onValid, typeTitle, clickSaveButton } = setUp();

  await typeTitle("input title");
  await clickSaveButton();

  expect(onClickSave).toHaveBeenCalled();
  expect(onInvalid).toHaveBeenCalled();
  expect(onValid).not.toHaveBeenCalled();
})

test("When you only input a image file, a validation error occurs", async () => {
  mockUploadImage();
  const { onClickSave, onInvalid, onValid, clickSaveButton } = setUp();
  const { selectImage } = selectImageFile();

  await selectImage();
  await clickSaveButton();

  expect(onClickSave).toHaveBeenCalled();
  expect(onInvalid).toHaveBeenCalled();
  expect(onValid).not.toHaveBeenCalled();
})

test("The form works with valid values when you save as a draft", async () => {
  mockUploadImage();
  const { onClickSave, onInvalid, onValid, typeTitle, clickSaveButton } = setUp();
  const { selectImage } = selectImageFile();

  await typeTitle("input title");
  await selectImage();
  await clickSaveButton();

  expect(onClickSave).toHaveBeenCalled();
  expect(onInvalid).not.toHaveBeenCalled();
  expect(onValid).toHaveBeenCalled();
})

test("You can toggle the status", async () => {
  setUp();

  expect(screen.queryByRole("button", { name: "記事を公開する" })).not.toBeInTheDocument();
  await user.click(screen.getByRole("switch", { name: "公開ステータス" }));

  expect(screen.getByRole("button", { name: "記事を公開する" })).toBeInTheDocument();
})