import {api} from "@shared/api";
import {useQuery} from "@tanstack/react-query";

export const useProfileProgressQuery = () => {
  const {data, ...query} = useQuery({
    queryKey: ["profile", "progress"],
    queryFn: async () => {
      const res = await api.profile.getProgress();

      return res.data;
    },
  });

  const progress = data?.progress;

  return [{progress}, query] as const;
};
