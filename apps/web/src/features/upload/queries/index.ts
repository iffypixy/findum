import {useMutation} from "@tanstack/react-query";

import {api} from "@shared/api";
import {UploadImageDto} from "@shared/api/upload";

export const useUploadImage = () => {
  const {mutateAsync, ...mutation} = useMutation({
    mutationFn: async (req: UploadImageDto["req"]) => {
      const res = await api.upload.uploadImage(req);

      return res.url;
    },
  });

  return {uploadImage: mutateAsync, ...mutation};
};
