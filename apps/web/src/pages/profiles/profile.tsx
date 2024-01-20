import {useEffect, useState} from "react";
import {useParams} from "wouter";
import {useTranslation} from "react-i18next";

import {Avatar, Button, ContentTemplate, H3, H5, H6, Icon} from "@shared/ui";
import {api} from "@shared/api";
import {Nullable, Relationship, UserProfile} from "@shared/lib/types";
import {useSelector} from "react-redux";
import {authModel} from "@features/auth";
import {navigate} from "wouter/use-location";
import {BiMessageSquareDetail} from "react-icons/bi";
import {dayjs} from "@shared/lib/dayjs";
import wall from "@shared/assets/wall.jpg";

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
                  <Icon.Resume />

                  <span className="underline underline-offset-4">
                    {t("common.view-resume")}
                  </span>
                </a>
              ) : (
                <span className="inline-flex space-x-2 items-center text-accent text-[#C0BEBE]">
                  <Icon.Resume />

                  <span className="underline underline-offset-4">
                    {t("common.view-resume")}
                  </span>
                </span>
              )}

              <div className="flex space-x-4 items-center">
                {isMe && (
                  <Button onClick={() => navigate("/settings")}>
                    {t("common.edit-profile")}
                  </Button>
                )}

                {!isMe && (
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
              <svg
                width="214"
                height="196"
                viewBox="0 0 214 196"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="m-auto"
              >
                <circle
                  opacity="0.2"
                  cx="107.005"
                  cy="108.002"
                  r="87.5492"
                  fill="#8193F3"
                />
                <circle cx="24.943" cy="48.8878" r="5.48741" fill="#ECF6EF" />
                <circle cx="137.435" cy="10.2265" r="10.2265" fill="#ECF6EF" />
                <circle cx="33.174" cy="177.842" r="9.72769" fill="#ECF6EF" />
                <circle cx="200.79" cy="154.895" r="9.72769" fill="#ECF6EF" />
                <circle cx="181.833" cy="165.87" r="4.73913" fill="#ECF6EF" />
                <path
                  d="M113.271 24.9809C112.692 24.8576 112.692 24.0301 113.271 23.9068L116.205 23.2831C116.416 23.2381 116.581 23.0735 116.627 22.8624L117.262 19.9342C117.387 19.3573 118.21 19.3573 118.335 19.9342L118.97 22.8624C119.016 23.0735 119.181 23.2381 119.392 23.2831L122.326 23.9068C122.905 24.0301 122.905 24.8576 122.326 24.9809L119.392 25.6046C119.181 25.6496 119.016 25.8142 118.97 26.0253L118.335 28.9535C118.21 29.5303 117.387 29.5303 117.262 28.9534L116.627 26.0253C116.581 25.8142 116.416 25.6496 116.205 25.6046L113.271 24.9809Z"
                  fill="#8193F3"
                />
                <path
                  d="M11.5935 116.366C11.8172 115.308 13.3263 115.308 13.5501 116.366L14.6603 121.611C14.7418 121.995 15.0414 122.297 15.4258 122.381L20.6584 123.521C21.708 123.749 21.7079 125.246 20.6584 125.475L15.4258 126.615C15.0414 126.698 14.7418 127 14.6603 127.385L13.5501 132.63C13.3263 133.687 11.8172 133.687 11.5935 132.63L10.4832 127.385C10.4018 127 10.1022 126.698 9.71778 126.615L4.48513 125.475C3.43561 125.246 3.43561 123.749 4.48513 123.521L9.71778 122.381C10.1022 122.297 10.4018 121.995 10.4832 121.611L11.5935 116.366Z"
                  fill="#8193F3"
                />
                <path
                  d="M184.757 53.5097C184.981 52.4525 186.49 52.4525 186.714 53.5097L187.129 55.4725C187.211 55.8574 187.51 56.1588 187.895 56.2425L189.892 56.6776C190.942 56.9063 190.942 58.4032 189.892 58.6318L187.895 59.0669C187.51 59.1507 187.211 59.452 187.129 59.8369L186.714 61.7997C186.49 62.8569 184.981 62.8569 184.757 61.7997L184.342 59.8369C184.26 59.452 183.961 59.1507 183.576 59.0669L181.579 58.6318C180.529 58.4032 180.529 56.9063 181.579 56.6776L183.576 56.2425C183.961 56.1588 184.26 55.8574 184.342 55.4725L184.757 53.5097Z"
                  fill="#8193F3"
                />
                <path
                  d="M205.358 124.879L206.886 132.096L214 133.646L206.886 135.196L205.358 142.413L203.83 135.196L196.716 133.646L203.83 132.096L205.358 124.879Z"
                  fill="white"
                />
                <path
                  d="M156.641 68.3432L38.6611 113.49L63.8534 183.579L79.0685 190.313L98.025 194.304L117.231 193.556L128.455 191.561L138.432 188.567L154.895 180.087L168.863 169.112L169.941 167.718C176.028 159.849 181.426 151.469 186.073 142.673L156.641 68.3432Z"
                  fill="#ECF6EF"
                />
              </svg>
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
            <svg
              width="214"
              height="196"
              viewBox="0 0 214 196"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="m-auto"
            >
              <circle
                opacity="0.2"
                cx="107.005"
                cy="108.002"
                r="87.5492"
                fill="#8193F3"
              />
              <circle cx="24.943" cy="48.8878" r="5.48741" fill="#ECF6EF" />
              <circle cx="137.435" cy="10.2265" r="10.2265" fill="#ECF6EF" />
              <circle cx="33.174" cy="177.842" r="9.72769" fill="#ECF6EF" />
              <circle cx="200.79" cy="154.895" r="9.72769" fill="#ECF6EF" />
              <circle cx="181.833" cy="165.87" r="4.73913" fill="#ECF6EF" />
              <path
                d="M113.271 24.9809C112.692 24.8576 112.692 24.0301 113.271 23.9068L116.205 23.2831C116.416 23.2381 116.581 23.0735 116.627 22.8624L117.262 19.9342C117.387 19.3573 118.21 19.3573 118.335 19.9342L118.97 22.8624C119.016 23.0735 119.181 23.2381 119.392 23.2831L122.326 23.9068C122.905 24.0301 122.905 24.8576 122.326 24.9809L119.392 25.6046C119.181 25.6496 119.016 25.8142 118.97 26.0253L118.335 28.9535C118.21 29.5303 117.387 29.5303 117.262 28.9534L116.627 26.0253C116.581 25.8142 116.416 25.6496 116.205 25.6046L113.271 24.9809Z"
                fill="#8193F3"
              />
              <path
                d="M11.5935 116.366C11.8172 115.308 13.3263 115.308 13.5501 116.366L14.6603 121.611C14.7418 121.995 15.0414 122.297 15.4258 122.381L20.6584 123.521C21.708 123.749 21.7079 125.246 20.6584 125.475L15.4258 126.615C15.0414 126.698 14.7418 127 14.6603 127.385L13.5501 132.63C13.3263 133.687 11.8172 133.687 11.5935 132.63L10.4832 127.385C10.4018 127 10.1022 126.698 9.71778 126.615L4.48513 125.475C3.43561 125.246 3.43561 123.749 4.48513 123.521L9.71778 122.381C10.1022 122.297 10.4018 121.995 10.4832 121.611L11.5935 116.366Z"
                fill="#8193F3"
              />
              <path
                d="M184.757 53.5097C184.981 52.4525 186.49 52.4525 186.714 53.5097L187.129 55.4725C187.211 55.8574 187.51 56.1588 187.895 56.2425L189.892 56.6776C190.942 56.9063 190.942 58.4032 189.892 58.6318L187.895 59.0669C187.51 59.1507 187.211 59.452 187.129 59.8369L186.714 61.7997C186.49 62.8569 184.981 62.8569 184.757 61.7997L184.342 59.8369C184.26 59.452 183.961 59.1507 183.576 59.0669L181.579 58.6318C180.529 58.4032 180.529 56.9063 181.579 56.6776L183.576 56.2425C183.961 56.1588 184.26 55.8574 184.342 55.4725L184.757 53.5097Z"
                fill="#8193F3"
              />
              <path
                d="M205.358 124.879L206.886 132.096L214 133.646L206.886 135.196L205.358 142.413L203.83 135.196L196.716 133.646L203.83 132.096L205.358 124.879Z"
                fill="white"
              />
              <path
                d="M156.641 68.3432L38.6611 113.49L63.8534 183.579L79.0685 190.313L98.025 194.304L117.231 193.556L128.455 191.561L138.432 188.567L154.895 180.087L168.863 169.112L169.941 167.718C176.028 159.849 181.426 151.469 186.073 142.673L156.641 68.3432Z"
                fill="#ECF6EF"
              />
            </svg>
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
