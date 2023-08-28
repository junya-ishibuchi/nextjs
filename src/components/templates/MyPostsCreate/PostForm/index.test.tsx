import {render, screen, waitFor} from "@testing-library/react";
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
  const saveAsDraft = async () => {
    await user.click(screen.getByRole("button", { name: "下書き保存する" }));
  }
  const saveAsPublish = async () => {
    await user.click(screen.getByRole("button", { name: "下書き保存する" }));
  }

  return { onClickSave, onInvalid, onValid, typeTitle, saveAsDraft, saveAsPublish };
};

test("When you just save it, a validation error text shows", async () => {
  const { saveAsDraft } = setUp();
  await saveAsDraft();

  await waitFor(() => {
    expect(screen.getByRole("textbox", { name: "記事タイトル" })).toHaveErrorMessage("1文字以上入力してください");
  });
})

test("When you only input a title, a validation error occurs", async () => {
  const { onClickSave, onInvalid, onValid, typeTitle, saveAsDraft } = setUp();

  await typeTitle("input title");
  await saveAsDraft();

  expect(onClickSave).toHaveBeenCalled();
  expect(onInvalid).toHaveBeenCalled();
  expect(onValid).not.toHaveBeenCalled();
})

test("When you only input a image file, a validation error occurs", async () => {
  mockUploadImage();
  const { onClickSave, onInvalid, onValid, saveAsDraft } = setUp();
  const { selectImage } = selectImageFile();

  await selectImage();
  await saveAsDraft();

  expect(onClickSave).toHaveBeenCalled();
  expect(onInvalid).toHaveBeenCalled();
  expect(onValid).not.toHaveBeenCalled();
})

test("The form works with valid values when you save as a draft", async () => {
  mockUploadImage();
  const { onClickSave, onInvalid, onValid, typeTitle, saveAsDraft } = setUp();
  const { selectImage } = selectImageFile();

  await typeTitle("input title");
  await selectImage();
  await saveAsDraft();

  expect(onClickSave).toHaveBeenCalled();
  expect(onInvalid).not.toHaveBeenCalled();
  expect(onValid).toHaveBeenCalled();
})

test("When you publish a post, invalid and valid methods is not going to be called", async () => {
  mockUploadImage();
  const { onClickSave, onInvalid, onValid, typeTitle, saveAsPublish } = setUp();
  const { selectImage } = selectImageFile();

  await typeTitle("input title");
  await selectImage();
  await saveAsPublish();

  expect(onClickSave).toHaveBeenCalled();
  expect(onInvalid).not.toHaveBeenCalled();
  expect(onValid).not.toHaveBeenCalled();
})