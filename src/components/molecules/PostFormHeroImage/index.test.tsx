import {selectImageFile} from "@/tests/jest";
import {screen, waitFor} from "@testing-library/react";

test("画像が選択されていない時、ボタン表記は「イメージを選択する」", async () => {
  expect(
    await screen.findByRole("button", { name: "イメージを選択する" })
  ).toBeInTheDocument();
});

test("画像が選択されている時、ボタン表記は「イメージを変更する」", async () => {
  const { selectImage } = selectImageFile();
  await selectImage();
  expect(
    await screen.findByRole("button", { name: "イメージを変更する" })
  ).toBeInTheDocument();
});

test("画像選択でエラーがある時、ボタン表記はエラー文言になる", async () => {
  expect(
    await screen.findByRole("button", { name: "エラー" })
  ).toBeInTheDocument();
});

test("画像のアップロードに失敗した場合、アラートが表示される", async () => {
  const { selectImage } = selectImageFile();
  await selectImage();
  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent(
      "画像のアップロードに失敗しました"
    )
  );
});
