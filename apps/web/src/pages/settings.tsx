import {useState} from "react";
import * as Tabs from "@radix-ui/react-tabs";
import {cx} from "class-variance-authority";
import {Controller, useForm} from "react-hook-form";
import {twMerge} from "tailwind-merge";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";

import {
  Avatar,
  Button,
  ContentTemplate,
  H4,
  Icon,
  Select,
  Switch,
  TextField,
  Upload,
} from "@shared/ui";
import {Location, Nullable} from "@shared/lib/types";
import {countries} from "@shared/lib/location";
import {Modal, WrappedModalProps} from "@shared/lib/modal";
import {AvatarEditor} from "@shared/lib/avatars";
import {authModel} from "@features/auth";
import {api} from "@shared/api";
import {navigate} from "wouter/use-location";
import toast from "react-hot-toast";
import {useDispatch} from "@shared/lib/store";
import {setCredentials} from "@features/auth/model/actions";

type Tab = "profile" | "general";

interface ProfileSettingsForm {
  avatar: string;
  firstName: string;
  lastName: string;
  location: Location;
  cv: Nullable<string>;
}

interface AvatarEditorData {
  open: boolean;
  avatar: Nullable<File>;
}

export const SettingsPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>("profile");

  const credentials = useSelector(authModel.selectors.credentials);

  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);

  const [avatarEditor, setAvatarEditor] = useState<AvatarEditorData>({
    open: false,
    avatar: null,
  });

  const {control, register, handleSubmit, watch, setValue} =
    useForm<ProfileSettingsForm>({
      defaultValues: {
        firstName: credentials.data?.firstName,
        lastName: credentials.data?.lastName,
        location: credentials.data?.location,
        avatar: credentials.data?.avatar,
        cv: credentials.data?.profile.cv,
      },
    });

  const dispatch = useDispatch();

  const avatar = watch("avatar");
  const cv = watch("cv");

  const {t} = useTranslation();

  return (
    <>
      <ContentTemplate>
        <Tabs.Root
          value={currentTab}
          onValueChange={(tab) => {
            setCurrentTab(tab as Tab);
          }}
          className="flex flex-col h-[100%]"
        >
          <Tabs.List className="px-14">
            <Tabs.Trigger
              value="profile"
              className={cx("bg-paper rounded-t-lg px-10 py-2", {
                "bg-paper-brand": currentTab === "profile",
              })}
            >
              Profile
            </Tabs.Trigger>

            {/* <Tabs.Trigger
              value="general"
              className={cx("bg-paper rounded-t-lg px-10 py-2", {
                "bg-paper-brand": currentTab === "general",
              })}
            >
              General
            </Tabs.Trigger> */}
          </Tabs.List>

          <Tabs.Content value="profile" className="flex-1">
            <div className="h-[100%] bg-paper-brand p-14">
              <form
                onSubmit={handleSubmit((form) => {
                  api.profile
                    .editProfile({
                      firstName: form.firstName,
                      lastName: form.lastName,
                      avatar: form.avatar,
                      cv: form.cv || undefined,
                      location: form.location,
                    })
                    .then((res) => {
                      navigate("/");

                      dispatch(setCredentials(res.data.credentials));

                      toast.success("Successfully updated profile :)");
                    })
                    .catch(() => {
                      toast.error("Something's wrong :(");
                    });
                })}
                className="flex flex-col space-y-6"
              >
                <Controller
                  name="avatar"
                  control={control}
                  render={() => (
                    <Upload
                      onChange={(event) => {
                        const file = event.currentTarget.files![0];

                        if (file) {
                          setAvatarEditor({avatar: file!, open: true});
                        }
                      }}
                    >
                      <div
                        className={twMerge(
                          "w-28 h-28 bg-paper-contrast/10 rounded-full flex items-center justify-center transition border-2 border-transparent hover:border-accent overflow-hidden",
                        )}
                      >
                        {avatar ? (
                          <Avatar
                            src={avatar}
                            alt="Project's avatar"
                            className="w-[100%] h-auto"
                          />
                        ) : (
                          <Icon.Image className="w-12 h-auto text-main" />
                        )}
                      </div>
                    </Upload>
                  )}
                />

                <div className="flex justify-between space-x-8">
                  <div className="w-[50%] flex flex-col space-y-6">
                    <div className="flex items-center space-x-4">
                      <TextField
                        {...register("firstName")}
                        className="w-[100%] h-auto"
                      />

                      <TextField
                        {...register("lastName")}
                        className="w-[100%] h-auto"
                      />
                    </div>

                    <TextField
                      value={credentials.data?.email}
                      disabled
                      className="w-[100%] h-auto"
                    />

                    <div className="flex space-x-4">
                      <TextField
                        value="*********"
                        disabled
                        className="w-[50%] h-auto"
                      />

                      <Button
                        onClick={() => {
                          setIsChangePasswordModalOpen(true);
                        }}
                        type="button"
                        className="w-[50%]"
                      >
                        {t("common.change-password")}
                      </Button>
                    </div>
                  </div>

                  <div className="w-[50%] flex flex-col space-y-12 -mt-8">
                    <div className="flex flex-col space-y-4">
                      {/* <div className="flex flex-col space-y-2">
                        <span>* Choose your role in the team</span>

                        <div className="flex flex-col space-y-6">
                          <div className="flex space-x-4">
                            <TextField
                              {...register("role1")}
                              placeholder="1st role"
                              className="w-[50%] h-auto"
                            />

                            <TextField
                              {...register("role2")}
                              placeholder="2nd role"
                              className="w-[50%] h-auto"
                            />
                          </div>

                          <TextField
                            {...register("role3")}
                            placeholder="3rd role"
                            className="w-[calc(50%-0.5rem)] h-auto"
                          />
                        </div>
                      </div> */}

                      <div className="flex flex-col space-y-2">
                        <span>{t("common.upload-cv-to")}</span>

                        <div className="flex items-center space-x-4">
                          <Controller
                            name="cv"
                            control={control}
                            render={({field}) => (
                              <>
                                <TextField
                                  placeholder={
                                    !credentials.data?.profile.cv && !cv
                                      ? "No resume"
                                      : "resume.pdf"
                                  }
                                  disabled
                                  className="w-[50%] h-auto"
                                />

                                <Upload
                                  accept="application/pdf"
                                  onChange={({currentTarget}) => {
                                    const file = currentTarget.files![0];

                                    if (file) {
                                      api.upload
                                        .uploadImage({image: file})
                                        .then((data) => {
                                          if (data) {
                                            field.onChange(data.url);
                                          }
                                        });
                                    }
                                  }}
                                  className="w-[50%] flex"
                                >
                                  <Button className="w-[100%]" type="button">
                                    {t("common.upload")}
                                  </Button>
                                </Upload>
                              </>
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col space-y-4">
                        <Controller
                          name="location.country"
                          control={control}
                          render={({field}) => (
                            <Select.Root
                              name="location.country"
                              onValueChange={field.onChange}
                              value={field.value || undefined}
                              placeholder="Select country"
                              className="h-auto"
                            >
                              {countries.map((country) => (
                                <Select.Item key={country} value={country}>
                                  {country}
                                </Select.Item>
                              ))}
                            </Select.Root>
                          )}
                        />

                        <TextField
                          {...register("location.city")}
                          className="w-[50%] h-auto"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button className="w-[50%]">{t("common.cancel")}</Button>
                      <Button className="w-[50%]">
                        {t("common.save-all-changes")}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </Tabs.Content>

          <Tabs.Content value="general" className="flex-1">
            <ul className="h-[100%] flex-1 bg-paper-brand flex flex-col">
              <li className="flex justify-between items-center border-b border-paper-contrast/30 last:border-none p-6">
                <div className="flex flex-col">
                  <span className="text-lg font-semibold">
                    Hide personal information
                  </span>
                  <span className="text-paper-contrast/40">
                    Hides email & location
                  </span>
                </div>

                <Switch />
              </li>

              <li className="flex justify-between items-center border-b border-paper-contrast/30 last:border-none p-6">
                <div className="flex flex-col">
                  <span className="text-lg font-semibold">
                    Hide invite links
                  </span>
                  <span className="text-paper-contrast/40">
                    Recommended if you don't want random people accessing your
                    rooms
                  </span>
                </div>

                <Switch />
              </li>
            </ul>
          </Tabs.Content>
        </Tabs.Root>
      </ContentTemplate>

      {avatarEditor.open && (
        <AvatarEditor
          image={URL.createObjectURL(avatarEditor.avatar!)}
          open={avatarEditor.open}
          onSave={(blob) => {
            if (blob) {
              api.upload.uploadImage({image: blob as File}).then(({url}) => {
                setValue("avatar", url);
              });
            }

            setAvatarEditor({open: false, avatar: null});
          }}
          onClose={() => {
            setAvatarEditor({open: false, avatar: null});
          }}
        />
      )}

      <ChangePasswordModal
        open={isChangePasswordModalOpen}
        onClose={() => {
          setIsChangePasswordModalOpen(false);
        }}
      />
    </>
  );
};

interface ChangePasswordForm {
  currentPassword: string;
  password1: string;
  password2: string;
}

const ChangePasswordModal: React.FC<WrappedModalProps> = ({onClose, open}) => {
  const {register, handleSubmit, watch} = useForm<ChangePasswordForm>({
    defaultValues: {
      currentPassword: "",
      password1: "",
      password2: "",
    },
  });

  const {t} = useTranslation();

  const currentp = watch("currentPassword");
  const p1 = watch("password1");
  const p2 = watch("password2");

  return (
    <Modal open={open} onClose={onClose}>
      <div className="min-w-[30rem] flex flex-col rounded-lg shadow-md bg-paper space-y-8 p-12">
        <div className="flex flex-col space-y-2">
          <H4>{t("common.change-password-title")}</H4>

          <span className="text-paper-contrast/60">
            {t("common.change-password-subtitle")}
          </span>
        </div>

        <form
          onSubmit={handleSubmit((form) => {
            if (form.password1 === form.password2)
              api.profile
                .changePassword({
                  currentPassword: form.currentPassword,
                  newPassword: form.password1,
                })
                .finally(() => {
                  onClose();
                });
          })}
          className="flex flex-col space-y-6"
        >
          <div className="flex flex-col">
            <TextField
              {...register("currentPassword")}
              type="password"
              label={t("common.current-password")}
              placeholder="Enter your current password"
            />

            <TextField
              {...register("password1")}
              type="password"
              label={t("common.new-password")}
              placeholder="Enter your new password"
            />

            <TextField
              {...register("password2")}
              type="password"
              label={t("common.confirm-new-password")}
              placeholder="Enter your new password"
            />
          </div>

          <div className="flex items-center space-x-6">
            <Button
              onClick={() => {
                onClose();
              }}
              className="w-[50%]"
            >
              {t("common.cancel")}
            </Button>

            <Button
              disabled={!!(p1 !== p2 || !currentp)}
              type="submit"
              className="w-[50%]"
            >
              {t("common.save-all-changes")}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
