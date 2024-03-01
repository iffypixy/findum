import {GenericDto, request} from "@shared/lib/request";

export type GetPresignedUrlDto = GenericDto<
  {
    contentType: string;
  },
  {
    url: string;
    key: string;
  }
>;

const getPresignedUrl = (req: GetPresignedUrlDto["req"]) =>
  request<GetPresignedUrlDto["res"]>({
    url: "/api/upload/presigned",
    params: req,
  });

export type UploadImageDto = GenericDto<
  {
    image: File;
  },
  void
>;

export const uploadImage = async (req: UploadImageDto["req"]) => {
  const {
    data: {url, key},
  } = await getPresignedUrl({contentType: req.image.type});

  await request({
    url,
    data: req.image,
    method: "PUT",
  });

  return {
    url: `${import.meta.env.VITE_S3_URL}/${key}`,
  };
};
