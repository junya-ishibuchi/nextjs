import * as uploadImage from "../fetcher";
import {uploadImageData} from "@/services/client/UploadImage/__mock__/fixture";
import {ErrorStatus, HttpError} from "@/lib/error";

jest.mock("../fetcher");

export function mockUploadImage(status?: ErrorStatus) {
  if (status && status > 299) {
    return jest
      .spyOn(uploadImage, "uploadImage")
      .mockRejectedValueOnce(new HttpError(status).serialize())
  }
  return jest
    .spyOn(uploadImage, "uploadImage")
    .mockResolvedValueOnce(uploadImageData);
}