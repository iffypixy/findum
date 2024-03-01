import {api} from "@shared/api";
import {GetUserDto} from "@shared/api/users";
import {useQuery} from "@tanstack/react-query";

export const useUser = (req: GetUserDto["req"]) => {
  const result = useQuery({
    queryKey: ["users", "detail", req.id],
    queryFn: async () => {
      const res = await api.users.getUser(req);

      return res.data;
    },
  });

  const user = result.data?.user;

  return [{user}, result] as const;
};
