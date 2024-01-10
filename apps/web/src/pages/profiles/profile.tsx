import {useEffect, useState} from "react";
import {useParams} from "wouter";
import {useTranslation} from "react-i18next";

import {Avatar, Button, ContentTemplate, H2, H5, Icon} from "@shared/ui";
import {api} from "@shared/api";
import {Nullable, Relationship, UserProfile} from "@shared/lib/types";
import {useSelector} from "react-redux";
import {authModel} from "@features/auth";
import {navigate} from "wouter/use-location";
import {BiMessageSquareDetail} from "react-icons/bi";

export const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<Nullable<UserProfile>>(null);

  const {id} = useParams() as {id: string};

  const credentials = useSelector(authModel.selectors.credentials);

  const isMe = credentials.data?.id === id;

  const {t} = useTranslation();

  useEffect(() => {
    api.users.getUser({id}).then(({data}) => setUser(data.user));
  }, [id]);

  return (
    <ContentTemplate>
      <div className="w-[100%] min-h-[100%] flex flex-col bg-paper-brand">
        <div className="w-[100%] h-28 flex justify-end items-end bg-paper relative bg-center bg-cover space-y-6 py-8 px-[10rem]">
          <Avatar
            src={user?.avatar || ""}
            className="w-36 h-auto absolute left-[10rem] -bottom-1/2"
          />

          {credentials.data?.id !== user?.id && (
            <Button
              onClick={() => {
                switch (user?.relationship) {
                  case Relationship.NONE:
                    setUser({
                      ...user,
                      relationship: Relationship.REQUEST_SENT,
                    });

                    api.friends.sendFriendRequest({recipientId: user.id});
                    break;
                  case Relationship.REQUEST_RECEIVED:
                    setUser({
                      ...user,
                      relationship: Relationship.FRIENDS,
                    });

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
        </div>

        <div className="flex flex-col space-y-8 pt-32 py-8 px-[10rem]">
          <div className="flex justify-between items-center">
            <div className="flex flex-col space-y-2">
              <H2>
                {user?.firstName} {user?.lastName}
              </H2>

              <span>{user?.email}</span>
            </div>

            <div className="flex flex-col items-end space-y-4">
              <span>
                {user?.location.city}, {user?.location.country}
              </span>

              {user?.profile.cv && (
                <a
                  href={user?.profile.cv}
                  className="inline-flex space-x-2 items-center text-accent"
                >
                  <Icon.Resume />

                  <span className="underline underline-offset-4">
                    {t("common.view-resume")}
                  </span>
                </a>
              )}

              {isMe && (
                <Button
                  onClick={() => {
                    navigate(`/settings`);
                  }}
                >
                  {t("common.edit-profile")}
                </Button>
              )}

              {!isMe && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();

                    navigate(`/chat/private/${user?.id}`);
                  }}
                  className="p-3"
                >
                  <BiMessageSquareDetail />
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-6">
            <H5>{t("common.projects")}</H5>

            {Object.keys(user?.highlights || {}).length === 0 &&
              user?.history.length === 0 && (
                <span>{t("common.no-projects-yet")}</span>
              )}

            {user?.highlights && (
              <div className="flex space-x-6">
                {Object.entries(user?.highlights).map(
                  ([role, projects], idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-md bg-paper"
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

            <div className="flex items-center space-x-8 py-4 overflow-x-auto">
              {user?.history.map((member, idx) => (
                <div
                  key={idx}
                  role="presentation"
                  onClick={() => {
                    navigate(`/projects/${member.project.id}`);
                  }}
                  className="min-w-[20rem] flex space-x-6 items-center bg-paper p-6 rounded-xl shadow-md cursor-pointer"
                >
                  <Avatar
                    src={member.project.avatar}
                    className="w-[5rem] h-[5rem]"
                  />

                  <div className="flex flex-col space-y-2 justify-between">
                    <span className="font-semibold text-2xl">
                      {member.project.name}
                    </span>

                    <span className="text-paper-contrast/60">
                      {member.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-6">
            <H5>{t("common.reviews")}</H5>

            <div className="flex items-center space-x-8 overflow-x-auto pb-4">
              {user?.reviews.length === 0 && (
                <span>{t("common.no-projects-yet")}</span>
              )}

              {user?.reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="min-w-[25rem] flex flex-col bg-paper rounded-xl shadow-md relative space-y-4 p-8"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar src={review.author.avatar} />

                    <div className="flex flex-col">
                      <span className="text-xl">
                        {review.author.firstName} {review.author.lastName}
                      </span>
                      <span className="text-paper-contrast/60">
                        {review.project.name}
                      </span>
                    </div>
                  </div>

                  <p className="overflow-hidden break-all">
                    {review.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ContentTemplate>
  );
};
