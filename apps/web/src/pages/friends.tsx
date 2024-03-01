import {useState} from "react";
import * as Tabs from "@radix-ui/react-tabs";
import {cx} from "class-variance-authority";
import {useTranslation} from "react-i18next";
import * as Popover from "@radix-ui/react-popover";

import {
  Avatar,
  Button,
  ContentTemplate,
  H5,
  H6,
  Icon,
  Link,
  TextField,
} from "@shared/ui";
import {
  FriendCard,
  useMyFriends,
  usePotentialFriends,
  useFriendRequests,
  useRemoveFriend,
  queryKeys,
  useRejectFriendRequest,
  useAcceptFriendRequest,
} from "@features/friends";
import {navigate} from "wouter/use-location";
import {queryClient} from "@shared/lib/query";
import toast from "react-hot-toast";

enum Tab {
  MY_FRIENDS = "my-friends",
  INCOMING_REQUESTS = "incoming-requests",
}

export const FriendsPage: React.FC = () => {
  const {t} = useTranslation();

  const [currentTab, setCurrentTab] = useState<Tab>(Tab.MY_FRIENDS);

  const tabs: Array<{
    id: Tab;
    label: string;
  }> = [
    {
      id: Tab.MY_FRIENDS,
      label: t("friends.tabs.my-friends"),
    },
    {
      id: Tab.INCOMING_REQUESTS,
      label: t("friends.tabs.incoming-requests"),
    },
  ];

  return (
    <ContentTemplate>
      <Tabs.Root
        value={currentTab}
        onValueChange={(tab) => {
          setCurrentTab(tab as Tab);
        }}
        className="w-full h-full flex flex-col"
      >
        <Tabs.List>
          {tabs.map((tab) => (
            <Tabs.Trigger
              key={tab.id}
              value={tab.id}
              className={cx("rounded-t-xl px-10 py-2", {
                "bg-paper-brand": currentTab === tab.id,
              })}
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="bg-paper-brand flex-1 rounded-xl rounded-tl-none">
          <Tabs.Content value={Tab.MY_FRIENDS} className="h-full">
            <MyFriendsTab />
          </Tabs.Content>

          <Tabs.Content value={Tab.INCOMING_REQUESTS} className="h-full">
            <IncomingRequestsTab />
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </ContentTemplate>
  );
};

const MyFriendsTab: React.FC = () => {
  const {t} = useTranslation();

  const [{friends}] = useMyFriends();
  const [{potentialFriends}] = usePotentialFriends();

  const {removeFriend} = useRemoveFriend();

  const [search, setSearch] = useState("");

  const anyFriends = friends && friends.length !== 0;
  const anyPotentialFriends = potentialFriends && potentialFriends.length !== 0;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-end p-8 pb-0">
        <TextField
          value={search}
          onChange={(event) => {
            setSearch(event.currentTarget.value);
          }}
          placeholder="Search friends"
          className="h-auto"
        />
      </div>

      <div className="flex flex-col p-8">
        <div className="flex flex-col">
          {!anyFriends && <NoFriendsLabel />}

          {friends?.map((friend) => (
            <div
              key={friend.id}
              className="flex justify-between border-t border-[#D2D1D1] py-4"
            >
              <Link href={`/users/${friend.id}`}>
                <div className="flex items-center space-x-6">
                  <Avatar
                    src={friend.avatar}
                    alt="Friend's avatar"
                    className="w-14 h-auto"
                  />

                  <div className="flex flex-col space-y-0.5">
                    <H6 className="text-[#112042]">
                      {friend.firstName} {friend.lastName}
                    </H6>

                    <span className="text-[#817C7C] text-sm">
                      {friend.location.city}, {friend.location.country}
                    </span>
                  </div>
                </div>
              </Link>

              <div className="flex space-x-4 items-center">
                <Button
                  onClick={() => {
                    navigate(`/chats/private/${friend.id}`);
                  }}
                  color="primary"
                  className="p-3"
                >
                  <Icon.Message className="w-5 h-5" />
                </Button>

                <Popover.Root>
                  <Popover.Trigger>
                    <Button color="secondary" className="p-3">
                      <Icon.Trash className="w-5 h-5" />
                    </Button>
                  </Popover.Trigger>

                  <Popover.Portal>
                    <Popover.Content
                      side="bottom"
                      align="center"
                      className="mt-4"
                    >
                      <div className="w-[20rem] flex flex-col bg-paper rounded-lg shadow-md space-y-4 p-6">
                        <H6>{t("friends.labels.delete-friend")}</H6>

                        <div className="flex items-center text-sm space-x-4">
                          <Popover.Close asChild>
                            <Button color="secondary" className="w-[50%]">
                              {t("common.cancel")}
                            </Button>
                          </Popover.Close>

                          <Button
                            onClick={() => {
                              removeFriend({
                                friendId: friend.id,
                              }).then(() => {
                                toast.success(
                                  "You successfully deleted a friend! :)",
                                );
                              });

                              queryClient.setQueryData(
                                queryKeys.list.queryKey,
                                {
                                  friends: friends.filter(
                                    (f) => f.id !== friend.id,
                                  ),
                                },
                              );
                            }}
                            className="w-[50%]"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>
              </div>
            </div>
          ))}
        </div>
      </div>

      {anyPotentialFriends && (
        <div className="flex flex-col border-t border-[#D2D1D1] p-8">
          <H5 className="text-[#000000] font-normal text-xl">
            {t("friends.potential-friends.title")}
          </H5>

          <div className="flex">
            {potentialFriends?.map((friend) => (
              <div key={friend.id} className="w-[14rem]">
                <FriendCard user={friend}>
                  <Button className="space-x-2">
                    <Icon.Plus />

                    <span>Add friend</span>
                  </Button>
                </FriendCard>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const NoFriendsLabel: React.FC = () => {
  const {t} = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 my-16 mx-auto">
      <Icon.Empty />

      <div className="flex flex-col justify-center items-center space-y-2">
        <H6 className="text-[#817C7C] font-medium text-xl max-w-[18rem]">
          {t("friends.no-friends.title")}
        </H6>

        <span className="text-[#B6B6B6] max-w-[22rem]">
          {t("friends.no-friends.subtitle")}
        </span>
      </div>
    </div>
  );
};

const IncomingRequestsTab: React.FC = () => {
  const {t} = useTranslation();

  const [{friendRequests}] = useFriendRequests();

  const [search, setSearch] = useState("");

  const {mutateAsync: rejectFriendRequest} = useRejectFriendRequest();
  const {mutateAsync: acceptFriendRequest} = useAcceptFriendRequest();

  const anyRequests = friendRequests && friendRequests.length !== 0;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-end p-8 pb-0">
        <TextField
          value={search}
          onChange={(event) => {
            setSearch(event.currentTarget.value);
          }}
          placeholder="Search requests"
          className="h-auto"
        />
      </div>

      {!anyRequests && (
        <div className="flex-1 flex flex-col justify-center items-center my-16 space-y-6 p-8">
          <Icon.Empty />

          <div className="flex flex-col items-center justify-center text-center space-y-2 m-auto">
            <H6 className="text-[#817C7C] font-medium text-xl max-w-[18rem]">
              {t("friends.no-requests.title")}
            </H6>

            <span className="text-[#B6B6B6] max-w-[22rem]">
              {t("friends.no-requests.subtitle")}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col space-y-8 p-8">
        {anyRequests && (
          <div className="flex space-x-6">
            {friendRequests.map((user) => (
              <div key={user.id} className="w-[14rem]">
                <FriendCard user={user}>
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={(event) => {
                        event.stopPropagation();

                        rejectFriendRequest({
                          senderId: user.id,
                        }).then(() => {
                          toast.success(
                            "You successfully rejected a friend request! :)",
                          );

                          queryClient.setQueryData(
                            queryKeys.requests.queryKey,
                            {
                              friendRequests: friendRequests.filter(
                                (r) => r.id !== user.id,
                              ),
                            },
                          );
                        });
                      }}
                      color="secondary"
                      className="p-2"
                    >
                      <Icon.Trash />
                    </Button>

                    <Button
                      onClick={(event) => {
                        event.stopPropagation();

                        acceptFriendRequest({
                          senderId: user.id,
                        }).then(() => {
                          toast.success(
                            "You successfully accepted a friend request! :)",
                          );

                          queryClient.setQueryData(
                            queryKeys.requests.queryKey,
                            {
                              friendRequests: friendRequests.filter(
                                (r) => r.id !== user.id,
                              ),
                            },
                          );
                        });
                      }}
                      color="primary"
                      className="w-1/2 px-2 flex-1"
                    >
                      Accept
                    </Button>
                  </div>
                </FriendCard>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
