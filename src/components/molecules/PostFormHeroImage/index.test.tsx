import {selectImageFile} from "@/tests/jest";
import {mockUploadImage} from "@/services/client/UploadImage/__mock__/jest";
import {render, screen, waitFor} from "@testing-library/react";
import {BasicLayout} from "@/components/layouts/BasicLayout";
import {PostFormHeroImage} from "@/components/molecules/PostFormHeroImage/index";
import {useForm} from "react-hook-form";
import {PutInput} from "@/pages/api/my/posts/[postId]";

const TestComponent = ({ error }: { error?: string }) => {
  const { register, setValue } = useForm<PutInput>()
  return BasicLayout(
      <PostFormHeroImage register={register} setValue={setValue} name="imageUrl" error={error} />
  )
}
test("画像が選択されていない時、ボタン表記は「イメージを選択する」", async () => {
  render(<TestComponent />)
  expect(
    await screen.findByRole("button", { name: "イメージを選択する" })
  ).toBeInTheDocument();
});

test("画像が選択されている時、ボタン表記は「イメージを変更する」", async () => {
  mockUploadImage();
  render(<TestComponent />)
  const { selectImage } = selectImageFile();
  await selectImage();
  expect(
    await screen.findByRole("button", { name: "イメージを変更する" })
  ).toBeInTheDocument();
});

test("画像選択でエラーがある時、ボタン表記はエラー文言になる", async () => {
  render(<TestComponent error="エラー"/>)
  expect(
    await screen.findByRole("button", { name: "エラー" })
  ).toBeInTheDocument();
});

test("画像のアップロードに失敗した場合、アラートが表示される", async () => {
  mockUploadImage(500);
  render(<TestComponent />)
  const { selectImage } = selectImageFile();
  await selectImage();
  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent(
      "画像のアップロードに失敗しました"
    )
  );
});
