import {createQueryKeys} from "@lukemorales/query-key-factory";
import {useMutation, useQuery} from "@tanstack/react-query";

import {api} from "@shared/api";
import {
  AcceptFriendRequestDto,
  RejectFriendRequestDto,
  RemoveFriendDto,
  SendFriendRequestDto,
} from "@shared/api/friends";

export const useMyFriends = () => {
  const result = useQuery({
    ...queryKeys.list,
    queryFn: async () => {
      const res = await api.friends.getMyFriends();

      return res.data;
    },
  });

  const friends = result.data?.friends;

  return [{friends}, result] as const;
};

export const useFriendRequests = () => {
  const result = useQuery({
    ...queryKeys.requests,
    queryFn: async () => {
      const res = await api.friends.getFriendRequests();

      return res.data;
    },
  });

  const friendRequests = result.data?.friendRequests;

  return [{friendRequests}, result] as const;
};

export const usePotentialFriends = () => {
  const result = useQuery({
    ...queryKeys.potential,
    queryFn: async () => {
      const res = await api.friends.getPotentialFriends();

      return res.data;
    },
  });

  const potentialFriends = result.data?.potentialFriends;

  return [{potentialFriends}, result] as const;
};

export const useRemoveFriend = () => {
  const {mutateAsync, ...mutation} = useMutation({
    mutationFn: (req: RemoveFriendDto["req"]) => api.friends.removeFriend(req),
  });

  return {removeFriend: mutateAsync, ...mutation};
};

export const useAcceptFriendRequest = () =>
  useMutation({
    mutationFn: (req: AcceptFriendRequestDto["req"]) =>
      api.friends.acceptFriendRequest(req),
  });

export const useRejectFriendRequest = () =>
  useMutation({
    mutationFn: (req: RejectFriendRequestDto["req"]) =>
      api.friends.rejectFriendRequest(req),
  });

export const useSendFriendRequest = (req: SendFriendRequestDto["req"]) =>
  useMutation({
    mutationFn: () => api.friends.sendFriendRequest(req),
  });

export const queryKeys = createQueryKeys("friends", {
  list: ["list"],
  requests: ["requests"],
  potential: ["potential"],
});
