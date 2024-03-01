import {useParams} from "wouter";
import {useTranslation} from "react-i18next";
import {BiMessageSquareDetail} from "react-icons/bi";

import {
  Avatar,
  Button,
  ContentTemplate,
  H3,
  H5,
  H6,
  Icon,
  Link,
} from "@shared/ui";
import {api} from "@shared/api";
import {Id, Relationship} from "@shared/lib/types";
import {dayjs} from "@shared/lib/dayjs";
import wall from "@shared/assets/wall.jpg";
import {useCredentials} from "@features/auth";
import {useUser} from "@features/users";
import {queryClient} from "@shared/lib/query";
import {navigate} from "wouter/use-location";

export const UserPage: React.FC = () => {
  const {t} = useTranslation();

  const {userId} = useParams() as {userId: Id};

  const [{credentials}] = useCredentials();

  const isMe = credentials?.id === userId;

  const [{user}] = useUser({id: userId});

  return (
    <ContentTemplate>
      <div className="flex flex-col space-y-6 max-w-[75rem] w-[100%] m-auto">
        <div className="flex flex-col rounded-2xl overflow-hidden bg-paper-brand">
          <div className="w-[100%] h-[35%] rounded-2xl overflow-hidden">
            <img src={wall} alt="wall" className="w-[100%] h-[100%]" />
          </div>

          <div className="w-[100%] h-[65%] flex justify-between p-8 relative">
            {user?.avatar && (
              <Avatar
                src={user.avatar}
                className="w-[9rem] h-auto absolute left-[3%] -top-[4.5rem]"
              />
            )}

            <div className="flex flex-col space-y-2 mt-[5.5%]">
              <H3>
                {user?.firstName} {user?.lastName}
              </H3>

              <span className="text-sm text-paper-contrast/60">
                {user?.email}
              </span>
            </div>

            <div className="flex flex-col space-y-4 mt-[1.5%] items-end">
              <span className="text-[#817C7C]">
                {user?.location?.city}, {user?.location?.country}
              </span>

              {user?.profile.cv ? (
                <a
                  href={user?.profile.cv}
                  className="inline-flex space-x-2 items-center text-accent"
                >
                  <Icon.Cv />

                  <span className="underline underline-offset-4">
                    {t("users.buttons.view-resume")}
                  </span>
                </a>
              ) : (
                <span className="inline-flex space-x-2 items-center text-accent text-[#C0BEBE]">
                  <Icon.Cv />

                  <span className="underline underline-offset-4">
                    {t("users.buttons.view-resume")}
                  </span>
                </span>
              )}

              <div className="flex space-x-4 items-center">
                {isMe && (
                  <Link href="/settings">
                    <Button>{t("users.buttons.edit-profile")}</Button>
                  </Link>
                )}

                {!isMe && (
                  <Button
                    onClick={() => {
                      switch (user?.relationship) {
                        case Relationship.NONE:
                          queryClient.setQueryData(
                            ["users", "detail", user.id],
                            {
                              user: {
                                ...user,
                                relationship: Relationship.REQUEST_SENT,
                              },
                            },
                          );

                          api.friends.sendFriendRequest({recipientId: user.id});
                          break;
                        case Relationship.REQUEST_RECEIVED:
                          queryClient.setQueryData(
                            ["users", "detail", user.id],
                            {
                              user: {
                                ...user,
                                relationship: Relationship.FRIENDS,
                              },
                            },
                          );

                          api.friends.acceptFriendRequest({senderId: user.id});
                          break;
                      }
                    }}
                    disabled={
                      user?.relationship === Relationship.FRIENDS ||
                      user?.relationship === Relationship.REQUEST_SENT
                    }
                  >
                    {user?.relationship === Relationship.NONE
                      ? "Add friend"
                      : user?.relationship === Relationship.REQUEST_RECEIVED
                      ? "Accept friend request"
                      : user?.relationship === Relationship.REQUEST_SENT
                      ? "Friend request sent"
                      : "You are friends"}
                  </Button>
                )}

                {!isMe && (
                  <Link href={`/chats/private/${user?.id}`}>
                    <Button className="p-3">
                      <BiMessageSquareDetail />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col rounded-2xl overflow-hidden bg-paper-brand p-8">
          <div className="flex flex-col space-y-6">
            <H5>Projects</H5>

            {user?.highlights && (
              <div className="flex space-x-6">
                {Object.entries(user?.highlights).map(
                  ([role, projects], idx) => (
                    <div
                      key={idx}
                      className="py-1 px-2 rounded-md bg-paper"
                      style={{
                        color: ["#9554FF", "#47B33E", "#F59E0B"][idx],
                      }}
                    >
                      {role} ({projects})
                    </div>
                  ),
                )}
              </div>
            )}

            <div className="w-[100%] h-[1px] bg-accent-300 opacity-70" />

            {user?.history.length === 0 && (
              <div className="flex flex-col text-center justify-center items-center m-auto space-y-6">
                <Icon.Empty className="m-auto" />

                <H6 className="text-[#817C7C] font-manrope font-medium">
                  {t("users.labels.no-projects")}
                </H6>

                <Button
                  onClick={() => {
                    navigate("/projects?tab=all-projects");
                  }}
                >
                  Explore
                </Button>
              </div>
            )}

            {user?.history.map((history, idx) => (
              <div
                key={idx}
                className="flex items-center w-[100%] justify-between"
              >
                <div className="flex items-center space-x-6">
                  <Avatar
                    src={history.project.avatar}
                    className="w-[4.5rem] h-auto"
                  />

                  <div className="flex flex-col space-y-1">
                    <H5>{history.role}</H5>

                    <span className="text-paper-contrast/60">
                      {history.project.name}
                    </span>
                  </div>
                </div>

                <div className="justify-start text-sm text-paper-contrast/50">
                  <span>{dayjs(history.startDate).format("LL")} - </span>
                  {history.endDate ? (
                    <span>{dayjs(history.endDate).format("LL")}</span>
                  ) : (
                    <span>now</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col rounded-2xl overflow-hidden bg-paper-brand p-8 space-y-6">
          <H5>Reviews</H5>

          <div className="w-[100%] h-[1px] bg-accent-300 opacity-70" />

          {user?.reviews.length === 0 && (
            <div className="flex flex-col text-center justify-center items-center m-auto space-y-6">
              <Icon.Empty className="m-auto" />

              <H6 className="text-[#817C7C] font-manrope font-medium">
                {t("users.labels.no-reviews")}
              </H6>
            </div>
          )}

          {user?.reviews.map((review, idx) => (
            <div key={idx} className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex space-x-4 items-center">
                  <Avatar
                    src={review.author.avatar}
                    alt="avatar"
                    className="w-[4.5rem] h-auto"
                  />

                  <div className="flex flex-col space-y-1">
                    <H6>
                      {review.author.firstName} {review.author.lastName}
                    </H6>

                    <span className="text-paper-contrast/40 font-semibold">
                      {review.project.name}
                    </span>
                  </div>
                </div>

                {review.rating === "LIKE" ? (
                  <Icon.Heart className="fill-[#EB5A5A]" />
                ) : (
                  <Icon.Heart className="fill-paper-brand" />
                )}
              </div>

              <p className="text-paper-contrast/50">{review.description}</p>
            </div>
          ))}
        </div>
      </div>
    </ContentTemplate>
  );
};
