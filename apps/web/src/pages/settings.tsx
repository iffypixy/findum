import {useState} from "react";
import * as Tabs from "@radix-ui/react-tabs";
import {cx} from "class-variance-authority";
import {Controller, useForm} from "react-hook-form";
import {twMerge} from "tailwind-merge";
import {useTranslation} from "react-i18next";
import toast from "react-hot-toast";
import {useLocation} from "wouter";

import {
  Avatar,
  Button,
  ContentTemplate,
  H4,
  Icon,
  Modal,
  ModalWindowPropsWithClose,
  Select,
  Switch,
  TextField,
  Upload,
} from "@shared/ui";
import {Location, Nullable} from "@shared/lib/types";
import {countries} from "@shared/lib/location";
import {AvatarEditor} from "@shared/lib/avatar-editor";
import {
  useChangePassword,
  useCredentials,
  useEditProfile,
} from "@features/auth";
import {useUploadImage} from "@features/upload";

enum Tab {
  PROFILE = "profile",
  GENERAL = "general",
}

export const SettingsPage: React.FC = () => {
  const {t} = useTranslation();

  const [, navigate] = useLocation();

  const [currentTab, setCurrentTab] = useState<Tab>(Tab.PROFILE);

  const [{credentials}] = useCredentials();

  const {editProfile} = useEditProfile();
  const {uploadImage} = useUploadImage();

  const {control, register, handleSubmit, watch, setValue} = useForm<{
    avatar: string;
    firstName: string;
    lastName: string;
    location: Location;
    cv: Nullable<string>;
  }>({
    defaultValues: {
      firstName: credentials?.firstName,
      lastName: credentials?.lastName,
      location: credentials?.location,
      avatar: credentials?.avatar,
      cv: credentials?.profile.cv,
    },
  });

  const [uploadedAvatar, setUploadedAvatar] = useState<Nullable<File>>(null);

  const avatar = watch("avatar");
  const cv = watch("cv");

  const tabs = [
    {
      id: Tab.PROFILE,
      label: "Profile",
    },
    // {
    //   id: Tab.GENERAL,
    //   label: "General",
    // },
  ];

  return (
    <>
      {uploadedAvatar && (
        <Modal.RootFn open>
          {({close}) => (
            <AvatarEditor
              image={URL.createObjectURL(uploadedAvatar)}
              close={close}
              onSave={(avatar) => {
                if (avatar) {
                  uploadImage({image: avatar as File}).then((url) => {
                    setValue("avatar", url);
                  });
                }

                setUploadedAvatar(null);
              }}
            />
          )}
        </Modal.RootFn>
      )}

      <ContentTemplate preserveNoScroll>
        <Tabs.Root
          value={currentTab}
          onValueChange={(tab) => {
            setCurrentTab(tab as Tab);
          }}
          className="flex flex-col w-full h-full"
        >
          <Tabs.List>
            {tabs.map((tab) => (
              <Tabs.Trigger
                key={tab.id}
                value={tab.id}
                className={cx("bg-paper rounded-t-xl px-10 py-2", {
                  "bg-paper-brand": currentTab === tab.id,
                })}
              >
                {tab.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <Tabs.Content
            value={Tab.PROFILE}
            className="flex-1 bg-paper-brand rounded-xl rounded-tl-none"
          >
            <div className="h-full p-8 flex flex-1">
              <form
                onSubmit={handleSubmit((form) => {
                  editProfile({
                    firstName: form.firstName,
                    lastName: form.lastName,
                    avatar: form.avatar,
                    cv: form.cv || undefined,
                    location: form.location,
                  }).then(() => {
                    toast.success("Successfully updated profile :)");

                    navigate("/");
                  });
                })}
                className="flex flex-col space-y-8"
              >
                <Upload
                  onChange={(event) => {
                    const file = event.currentTarget.files![0];

                    if (file) setUploadedAvatar(file);
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
                      value={credentials?.email}
                      disabled
                      className="w-[100%] h-auto"
                    />

                    <div className="flex space-x-4">
                      <TextField
                        value="*********"
                        disabled
                        className="w-[50%] h-auto"
                      />

                      <Modal.RootFn>
                        {({close}) => (
                          <>
                            <Modal.Trigger>
                              <Button className="w-[50%] px-0">
                                {t("settings.buttons.change-password")}
                              </Button>
                            </Modal.Trigger>

                            <ChangePasswordModal close={close} />
                          </>
                        )}
                      </Modal.RootFn>
                    </div>
                  </div>

                  <div className="w-[50%] flex flex-col space-y-36 -mt-8">
                    <div className="flex flex-col space-y-4">
                      <div className="flex flex-col space-y-2">
                        <span>{t("settings.helpers.upload-cv")}</span>

                        <div className="flex items-center space-x-4">
                          <Controller
                            name="cv"
                            control={control}
                            render={({field}) => (
                              <>
                                <TextField
                                  placeholder={
                                    !credentials?.profile.cv && !cv
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
                                      uploadImage({
                                        image: file,
                                      }).then((url) => {
                                        field.onChange(url);
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

                      <div className="flex space-x-4">
                        <Controller
                          name="location.country"
                          control={control}
                          render={({field}) => (
                            <Select.Root
                              name="location.country"
                              onValueChange={field.onChange}
                              value={field.value || undefined}
                              placeholder="Select country"
                              className="h-auto w-[50%]"
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
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>{t("settings.buttons.save-changes")}</Button>
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
    </>
  );
};

const ChangePasswordModal: React.FC<ModalWindowPropsWithClose> = ({close}) => {
  const {register, handleSubmit, watch} = useForm<{
    currentPassword: string;
    password1: string;
    password2: string;
  }>({
    defaultValues: {
      currentPassword: "",
      password1: "",
      password2: "",
    },
  });

  const {changePassword} = useChangePassword();

  const {t} = useTranslation();

  const currentPassword = watch("currentPassword");
  const p1 = watch("password1");
  const p2 = watch("password2");

  return (
    <Modal.Window>
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-2">
          <H4>{t("settings.modals.change-password.title")}</H4>

          <span className="text-paper-contrast/60">
            {t("settings.modals.change-password.subtitle")}
          </span>
        </div>

        <form
          onSubmit={handleSubmit((form) => {
            if (form.password1 === form.password2) {
              changePassword({
                currentPassword: form.currentPassword,
                newPassword: form.password1,
              }).finally(() => {
                close();
              });
            }
          })}
          className="flex flex-col space-y-6"
        >
          <div className="flex flex-col">
            <TextField
              {...register("currentPassword")}
              type="password"
              label={t("common.fields.current-password")}
              placeholder="Enter your current password"
            />

            <TextField
              {...register("password1")}
              type="password"
              label={t("common.fields.new-password")}
              placeholder="Enter your new password"
            />

            <TextField
              {...register("password2")}
              type="password"
              label={t("common.fields.new-password-confirmation")}
              placeholder="Enter your new password"
            />
          </div>

          <div className="flex items-center space-x-6">
            <Modal.Close>
              <Button className="w-[50%]" color="secondary">
                {t("common.cancel")}
              </Button>
            </Modal.Close>

            <Button
              disabled={!!(p1 !== p2 || !currentPassword)}
              type="submit"
              className="w-[50%]"
            >
              {t("settings.modals.change-password.buttons.update")}
            </Button>
          </div>
        </form>
      </div>
    </Modal.Window>
  );
};
