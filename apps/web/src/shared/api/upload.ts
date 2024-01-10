import {request} from "@shared/lib/request";

export interface GetPresignedUrlParams {
  contentType: string;
}

export interface GetPresignedUrlResponse {
  url: string;
  key: string;
}

export const getPresignedUrl = (params: GetPresignedUrlParams) =>
  request<GetPresignedUrlResponse>({
    url: "/api/upload/presigned",
    params,
  });

export interface UploadImageParams {
  image: File;
}

export interface UploadImageResponse {}

export const uploadImage = async (params: UploadImageParams) => {
  const type = params.image.type;

  const {
    data: {url, key},
  } = await getPresignedUrl({contentType: type});

  await request({
    url,
    data: params.image,
    method: "PUT",
  });

  return {
    url: `${import.meta.env.VITE_S3_URL}/${key}`,
  };
};
