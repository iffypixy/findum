import {PropsWithChildren, useEffect, useState} from "react";
import * as Tabs from "@radix-ui/react-tabs";
import {cx} from "class-variance-authority";
import {BiMessageSquareDetail, BiSearch, BiTrash} from "react-icons/bi";
import {BsPlus} from "react-icons/bs";
import * as Popover from "@radix-ui/react-popover";
import {useTranslation} from "react-i18next";

import {
  Avatar,
  Button,
  ContentTemplate,
  H3,
  H4,
  H6,
  TextField,
} from "@shared/ui";
import header from "@shared/assets/profile-header.png";
import {useDispatch} from "@shared/lib/store";
import {User, Nullable} from "@shared/lib/types";
import {api} from "@shared/api";
import {navigate} from "wouter/use-location";
import {useLocation} from "wouter";
import {useGeneralStore} from "@shared/lib/general";

type Tab = "my-friends" | "new-friends";

export const FriendsPage: React.FC = () => {
  const {t} = useTranslation();

  const [currentTab, setCurrentTab] = useState<Tab>("my-friends");

  const dispatch = useDispatch();

  const [friends, setFriends] = useState<Nullable<User[]>>(null);

  const [potentialFriends, setPotentialFriends] =
    useState<Nullable<User[]>>(null);

  const [requests, setRequests] = useState<Nullable<User[]>>(null);

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    api.friends
      .getFriendRequests()
      .then(({data}) => setRequests(data.friendRequests));

    api.friends.getMyFriends().then(({data}) => setFriends(data.friends));

    api.friends
      .getPotentialFriends()
      .then(({data}) => setPotentialFriends(data.potentialFriends));
  }, [dispatch]);

  const {friendRequests, addFriendRequests} = useGeneralStore((s) => s);

  const hasFriends = friends && friends.length > 0;

  return (
    <ContentTemplate>
      <Tabs.Root
        value={currentTab}
        onValueChange={(tab) => {
          setCurrentTab(tab as Tab);
        }}
        className="flex flex-col h-[100%]"
      >
        <Tabs.List className="px-14">
          <Container>
            <Tabs.Trigger
              value="my-friends"
              className={cx("bg-paper rounded-t-2xl px-10 py-2", {
                "bg-paper-brand": currentTab === "my-friends",
              })}
            >
              {t("common.my-friends")}
            </Tabs.Trigger>

            <Tabs.Trigger
              value="new-friends"
              className={cx("bg-paper rounded-t-2xl px-10 py-2", {
                "bg-paper-brand": currentTab === "new-friends",
              })}
            >
              {t("common.new-friends")}{" "}
              {friendRequests !== 0 && <>({friendRequests})</>}
            </Tabs.Trigger>
          </Container>
        </Tabs.List>

        <div className="bg-paper-brand flex-1">
          <Container>
            <Tabs.Content value="my-friends" className="flex-1 flex flex-col">
              {hasFriends ? (
                <div className="flex flex-col space-y-8 py-8">
                  <div className="flex justify-end px-14">
                    <TextField
                      placeholder="Enter your friend name"
                      value={searchText}
                      onChange={({currentTarget}) => {
                        setSearchText(currentTarget.value);
                      }}
                      type="text"
                      suffix={<BiSearch className="w-6 h-auto text-main" />}
                      className="h-auto"
                    />
                  </div>

                  <ul className="border-t border-paper-contrast/20">
                    {friends
                      .filter((user) => {
                        return (
                          user.firstName
                            .toLowerCase()
                            .startsWith(searchText.toLowerCase()) ||
                          user.lastName
                            .toLowerCase()
                            .startsWith(searchText.toLowerCase())
                        );
                      })
                      .map((user, idx) => (
                        <li
                          key={idx}
                          className="flex justify-between border-b border-paper-contrast/20 py-6 px-14 last:border-none"
                        >
                          <div
                            role="presentation"
                            onClick={() => {
                              navigate(`/profiles/${user.id}`);
                            }}
                            className="flex space-x-6 items-center cursor-pointer"
                          >
                            <Avatar src={user.avatar} className="w-16 h-auto" />

                            <div className="flex flex-col">
                              <span className="text-lg font-semibold">
                                {user.firstName} {user.lastName}
                              </span>
                            </div>
                          </div>

                          <div className="flex space-x-4 items-center">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();

                                navigate(`/chat/private/${user.id}`);
                              }}
                              className="p-3"
                            >
                              <BiMessageSquareDetail />
                            </Button>

                            <Popover.Root>
                              <Popover.Trigger>
                                <Button color="secondary" className="p-3">
                                  <BiTrash />
                                </Button>
                              </Popover.Trigger>

                              <Popover.Portal>
                                <Popover.Content side="bottom" align="start">
                                  <div className="w-[20rem] flex flex-col bg-paper rounded-lg shadow-md space-y-4 p-6">
                                    <H6>{t("common.delete-the-friend?")}</H6>

                                    <div className="flex items-center text-sm space-x-4">
                                      <Button
                                        color="secondary"
                                        className="w-[50%]"
                                      >
                                        {t("common.cancel")}
                                      </Button>
                                      <Button
                                        onClick={() => {
                                          api.friends.removeFriend({
                                            friendId: user.id,
                                          });
                                          setFriends(
                                            friends.filter(
                                              (f) => f.id !== user.id,
                                            ),
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
                        </li>
                      ))}
                  </ul>
                </div>
              ) : (
                <NoFriendsScreen />
              )}

              {potentialFriends && potentialFriends.length > 0 && (
                <PotentialFriendsSection potentialFriends={potentialFriends} />
              )}
            </Tabs.Content>

            <Tabs.Content value="new-friends" className="flex-1 flex flex-col">
              <div className="p-12">
                <div className="flex space-x-6 overflow-x-auto py-4">
                  {requests?.length === 0 && (
                    <div className="w-full flex justify-center items-center">
                      <H6>{t("common.no-friend-requests")}</H6>
                    </div>
                  )}

                  {requests?.map((user, idx) => (
                    <div
                      key={idx}
                      role="presentation"
                      className="min-w-[15rem] flex flex-col items-center bg-paper shadow-md relative rounded-2xl p-4 space-y-5 cursor-pointer"
                      onClick={() => {
                        navigate(`/profiles/${user.id}`);
                      }}
                    >
                      <img
                        src={header}
                        alt="Profile header"
                        className="absolute top-0 left-0"
                      />

                      <Avatar
                        src={user.avatar}
                        className="w-20 h-auto z-10 shadow-md"
                      />

                      <div className="flex flex-col text-center">
                        <span className="font-bold text-xl">
                          {user.firstName} {user.lastName}
                        </span>
                      </div>

                      <div className="flex items-center justify-between space-x-2">
                        <Button
                          color="secondary"
                          onClick={(e) => {
                            e.stopPropagation();

                            api.friends.rejectFriendRequest({
                              senderId: user.id,
                            });

                            addFriendRequests(-1);
                            setRequests(
                              requests.filter((u) => u.id !== user.id),
                            );
                          }}
                          className="w-[50%] text-xs"
                        >
                          {t("common.cancel")}
                        </Button>

                        <Button
                          onClick={(e) => {
                            e.stopPropagation();

                            api.friends.acceptFriendRequest({
                              senderId: user.id,
                            });

                            addFriendRequests(-1);
                            setRequests(
                              requests.filter((u) => u.id !== user.id),
                            );
                            setFriends(friends ? [...friends, user] : [user]);
                          }}
                          className="w-[50%] text-xs"
                        >
                          {t("common.accept")}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Tabs.Content>
          </Container>
        </div>
      </Tabs.Root>
    </ContentTemplate>
  );
};

const NoFriendsScreen: React.FC = () => {
  const {t} = useTranslation();

  return (
    <div className="flex flex-col justify-center items-center space-y-2 p-32">
      <H3>{t("common.you-have-no-friends")}</H3>

      <span className="text-paper-contrast/40">
        {t("common.lets-try-to-find-friends")}
      </span>
    </div>
  );
};

interface PotentialFriendsSectionProps {
  potentialFriends: User[];
}

const PotentialFriendsSection: React.FC<PotentialFriendsSectionProps> = ({
  potentialFriends,
}) => {
  return (
    <div className="flex flex-col space-y-8 p-14">
      <H4>You may know these people</H4>

      <div className="flex space-x-6 overflow-x-auto py-4">
        {potentialFriends.map((user, idx) => (
          <PotentialFriend key={idx} {...user} />
        ))}
      </div>
    </div>
  );
};

const PotentialFriend: React.FC<User> = (user) => {
  const [, navigate] = useLocation();

  const [sentReq, setSentReq] = useState(false);

  return (
    <div
      onClick={() => {
        navigate(`/profiles/${user.id}`);
      }}
      role="presentation"
      className="min-w-[15rem] flex flex-col items-center bg-paper shadow-md relative rounded-2xl p-4 space-y-5"
    >
      <img
        src={header}
        alt="Profile header"
        className="absolute top-0 left-0"
      />

      <Avatar src={user.avatar} className="w-20 h-auto z-10" />

      <div className="flex flex-col text-center">
        <span className="font-bold text-xl">
          {user.firstName} {user.lastName}
        </span>
      </div>

      {!sentReq ? (
        <Button
          onClick={(e) => {
            e.stopPropagation();

            api.friends.sendFriendRequest({recipientId: user.id});

            setSentReq(true);
          }}
          className="inline-flex space-x-2"
        >
          <div className="flex items-center justify-center border border-accent-contrast rounded-full">
            <BsPlus className="w-5 h-auto fill-accent-contrast" />
          </div>

          <span>Add friend</span>
        </Button>
      ) : (
        <Button disabled>Request sent</Button>
      )}
    </div>
  );
};

const Container: React.FC<PropsWithChildren> = ({children}) => (
  <div className="max-w-[80rem] m-auto relative">{children}</div>
);
