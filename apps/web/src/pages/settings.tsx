import {useState} from "react";
import * as Tabs from "@radix-ui/react-tabs";
import {cx} from "class-variance-authority";
import {Controller, useForm} from "react-hook-form";
import {twMerge} from "tailwind-merge";

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
import {Nullable} from "@shared/lib/types";
import {cities} from "@shared/lib/cities";
import {Modal, WrappedModalProps} from "@shared/lib/modal";
import {AvatarEditor} from "@shared/lib/avatars";

type Tab = "profile" | "general";

interface ProfileSettingsForm {
  avatar: Nullable<File>;
  firstName: string;
  lastName: string;
  location: Nullable<string>;
  role1: string;
  role2: string;
  role3: string;
  resume: Nullable<File>;
}

interface AvatarEditorData {
  open: boolean;
  avatar: Nullable<File>;
}

export const SettingsPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>("profile");

  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);

  const [avatarEditor, setAvatarEditor] = useState<AvatarEditorData>({
    open: false,
    avatar: null,
  });

  const {control, register, handleSubmit, watch, setValue} =
    useForm<ProfileSettingsForm>({
      defaultValues: {
        firstName: "Omar",
        lastName: "Moldaschev",
        location: "Astana",
        role1: "Software Engineer",
        role2: "Project manager",
        role3: "Data analyst",
      },
    });

  const avatar = watch("avatar");

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

            <Tabs.Trigger
              value="general"
              className={cx("bg-paper rounded-t-lg px-10 py-2", {
                "bg-paper-brand": currentTab === "general",
              })}
            >
              General
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="profile" className="flex-1">
            <div className="h-[100%] bg-paper-brand p-14">
              <form
                onSubmit={handleSubmit((form) => {
                  console.log(form);
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
                          setAvatarEditor({open: true, avatar: file});
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
                            src={URL.createObjectURL(avatar)}
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
                      value="omar.moldashev@gmail.com"
                      disabled
                      className="w-[100%] h-auto"
                    />

                    <Controller
                      name="location"
                      control={control}
                      render={({field}) => (
                        <Select.Root
                          name="location"
                          onValueChange={field.onChange}
                          value={field.value || undefined}
                          placeholder="Select location"
                          className="h-auto"
                        >
                          {cities.map((city) => (
                            <Select.Item key={city} value={city}>
                              {city}
                            </Select.Item>
                          ))}
                        </Select.Root>
                      )}
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
                        className="w-[50%]"
                      >
                        Change password
                      </Button>
                    </div>
                  </div>

                  <div className="w-[50%] flex flex-col space-y-12">
                    <div className="flex flex-col space-y-8">
                      <div className="flex flex-col space-y-2">
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
                      </div>

                      <div className="flex flex-col space-y-2">
                        <span>* Upload your CV in order to join to teams</span>

                        <div className="flex items-center space-x-4">
                          <Controller
                            name="resume"
                            control={control}
                            render={({field}) => (
                              <>
                                <TextField
                                  value={field.value?.name}
                                  placeholder="resume.pdf"
                                  disabled
                                  className="w-[50%] h-auto"
                                />

                                <Upload
                                  onChange={({currentTarget}) => {
                                    const file = currentTarget.files![0];

                                    if (file) {
                                      field.onChange(file);
                                    }
                                  }}
                                  className="w-[50%] flex"
                                >
                                  <Button className="w-[100%]">Upload</Button>
                                </Upload>
                              </>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button className="w-[50%]">Cancel</Button>
                      <Button className="w-[50%]">Save all changes</Button>
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
              setValue("avatar", blob as File);
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
  const {register, handleSubmit} = useForm<ChangePasswordForm>({
    defaultValues: {
      currentPassword: "",
      password1: "",
      password2: "",
    },
  });

  return (
    <Modal open={open} onClose={onClose}>
      <div className="min-w-[30rem] flex flex-col rounded-lg shadow-md bg-paper space-y-8 p-12">
        <div className="flex flex-col space-y-2">
          <H4>Change your password</H4>

          <span className="text-paper-contrast/60">
            Enter current and new password
          </span>
        </div>

        <form
          onSubmit={handleSubmit((form) => {
            console.log(form);
          })}
          className="flex flex-col space-y-6"
        >
          <div className="flex flex-col">
            <TextField
              {...register("currentPassword")}
              type="password"
              label="Current password"
              placeholder="Enter your current password"
            />

            <TextField
              {...register("password1")}
              type="password"
              label="New password"
              placeholder="Enter your new password"
            />

            <TextField
              {...register("password2")}
              type="password"
              label="Confirm new password"
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
              Cancel
            </Button>

            <Button type="submit" className="w-[50%]">
              Save changes
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
