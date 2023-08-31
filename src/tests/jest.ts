import userEvent from "@testing-library/user-event";
import {screen} from "@testing-library/react";
import {setupServer} from "msw/node";
import {RequestHandler} from "msw";

export function setupMockServer(...handler: RequestHandler[]) {
  const server = setupServer(...handler);
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  return server;
}

export function selectImageFile(
  testFileId = "file",
  fileName = "filename.png",
  content = "content"
) {
  const user = userEvent.setup();
  const filePath = `/Users/JohnDoe/${fileName}`;
  const file = new File([content], fileName, { type: "image/png" });
  const input = screen.getByTestId(testFileId);
  const selectImage = () => user.upload(input, file);

  return { selectImage, filePath }
}

const original = window.location;

export function mockWindowLocationReload() {
  Object.defineProperty(window, "location", {
    writable: true,
    value: { reload: jest.fn() },
  });
  const cleanup = () => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: original,
    });
  };
  return cleanup;
}
