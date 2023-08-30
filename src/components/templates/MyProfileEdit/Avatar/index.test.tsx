import {selectImageFile, setupMockServer} from "@/tests/jest";
import {mockUploadImage} from "@/services/client/UploadImage/__mock__/jest";
import {Avatar} from "@/components/templates/MyProfileEdit/Avatar/index";
import {useForm} from "react-hook-form";
import {render, screen, waitFor} from "@testing-library/react";
import {PutInput} from "@/pages/api/my/profile/edit";
import {BasicLayout} from "@/components/layouts/BasicLayout";
import {handleGetMyProfile} from "@/services/client/MyProfile/__mock__/msw";

setupMockServer(handleGetMyProfile())

const TestComponent = () => {
  const { register, setValue } = useForm<PutInput>();
  return BasicLayout(
    <Avatar register={register} setValue={setValue} name="imageUrl" />
  );
}

test("There is a image select button", () => {
  render(<TestComponent />);
  expect(screen.getByRole("button", { name: "写真を変更する" }));
})

test("When change an image button click, imageUrl is going to change", async () => {
  mockUploadImage();
  render(<TestComponent />);
  expect(screen.getByRole("img").getAttribute("src")).toBeFalsy();

  const { selectImage } = selectImageFile();
  await selectImage();

  await waitFor(() =>
    expect(screen.getByRole("img").getAttribute("src")).toBeTruthy()
  );
});

test("When change an image fail, the error dialog shows", async () => {
  mockUploadImage(500);
  render(<TestComponent />);

  const { selectImage } = selectImageFile();
  await selectImage();

  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent("画像のアップロードに失敗しました")
  );
});
