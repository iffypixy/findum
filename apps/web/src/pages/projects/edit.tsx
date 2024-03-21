import {Controller, useForm} from "react-hook-form";
import {twMerge} from "tailwind-merge";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import toast from "react-hot-toast";
import {useLocation, useParams} from "wouter";

import {
  Button,
  ContentTemplate,
  DatePicker,
  H3,
  Icon,
  Select,
  TextField,
  Textarea,
  Upload,
  Radio,
  Avatar,
  Modal,
  ModalWindowPropsWithClose,
  Link,
} from "@shared/ui";
import {countries} from "@shared/lib/location";
import {Id, Location, Nullable} from "@shared/lib/types";
import {AvatarEditor} from "@shared/lib/avatar-editor";
import {useEditProject, useProject} from "@features/projects";
import {useUploadImage} from "@features/upload";

export const EditProjectPage: React.FC = () => {
  const {t} = useTranslation();

  const [, navigate] = useLocation();
  const {projectId} = useParams() as {projectId: Id};

  const [{project}] = useProject({id: projectId});

  const {editProject} = useEditProject();
  const {uploadImage} = useUploadImage();

  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    formState: {isValid, errors},
  } = useForm<{
    name: string;
    description: string;
    startDate: Nullable<Date>;
    endDate: Nullable<Date>;
    avatar: Nullable<string>;
    location: Nullable<Location>;
  }>({
    mode: "onChange",
    values: {
      name: project?.name || "",
      description: project?.description || "",
      startDate: (project && new Date(project?.startDate)) || null,
      endDate:
        (project && project.endDate && new Date(project?.endDate)) || null,
      avatar: project?.avatar || null,
      location: {
        city: project?.location.city || "",
        country: project?.location.country || "",
      },
    },
  });

  const [uploadedAvatar, setUploadedAvatar] = useState<Nullable<File>>(null);

  const avatar = watch("avatar");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  return (
    <>
      <Modal.RootFn open={!!uploadedAvatar}>
        {({close}) => (
          <AvatarEditor
            image={uploadedAvatar!}
            close={() => {
              close();

              setUploadedAvatar(null);
            }}
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

      <ContentTemplate preserveNoScroll>
        <div className="w-full h-full flex flex-col bg-paper-brand">
          <div className="flex flex-col bg-paper space-y-2 p-8">
            <H3>{t("edit-project.title")}</H3>

            <span className="text-paper-contrast/40">
              {t("edit-project.subtitle")}
            </span>
          </div>

          <form
            onSubmit={handleSubmit((form) => {
              editProject({
                id: project!.id,
                name: form.name,
                description: form.description,
                avatar: avatar || undefined,
                location: form.location!,
                startDate: new Date(form.startDate!),
                endDate: form.endDate ? new Date(form.endDate!) : undefined,
              }).then(({project}) => {
                navigate(`/projects/${project.id}`);

                toast.success("Successfully created a project :)");
              });
            })}
            className="bg-paper-brand"
          >
            <div className="space-y-8 p-8">
              <div className="flex space-x-4 items-end">
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
                        className="w-full h-auto"
                      />
                    ) : (
                      <Icon.Image className="w-12 h-auto text-main" />
                    )}
                  </div>
                </Upload>
              </div>

              <div className="flex items-start justify-between">
                <div className="flex flex-col w-[47.5%] space-y-4">
                  <TextField
                    {...register("name", {required: true})}
                    placeholder="Name"
                    className="h-auto"
                  />

                  <Textarea
                    {...register("description", {
                      required: true,
                      minLength: {
                        message:
                          "Description field should have at least 200 characters",
                        value: 200,
                      },
                    })}
                    placeholder="Description"
                    error={errors.description?.message}
                  />
                </div>

                <div className="flex flex-col w-[47.5%] space-y-4 -mt-6">
                  <div className="flex items-center space-x-4">
                    <Controller
                      name="startDate"
                      control={control}
                      rules={{required: true}}
                      render={({field}) => (
                        <DatePicker
                          label="Start date"
                          toDate={endDate || undefined}
                          onSelect={(date) => field.onChange(date)}
                          className="w-[48%]"
                        />
                      )}
                    />

                    <Controller
                      name="endDate"
                      control={control}
                      rules={{required: true}}
                      render={({field}) => (
                        <DatePicker
                          label="End date"
                          fromDate={startDate || undefined}
                          onSelect={(date) => field.onChange(date)}
                          className="w-[48%]"
                        />
                      )}
                    />
                  </div>

                  <Controller
                    name="location.country"
                    control={control}
                    rules={{required: true}}
                    render={({field}) => (
                      <Select.Root
                        placeholder="Country"
                        onValueChange={field.onChange}
                        value={field.value || undefined}
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
                    {...register("location.city", {required: true})}
                    placeholder="City"
                    className="h-auto"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                {/* <div className="flex justify-between">
                  <div className="flex flex-col space-y-2">
                    <H6>Cards ({project?.cards.length}/4)</H6>

                    <span className="text-sm text-paper-contrast/40">
                      You may create up to 4 cards in one room
                    </span>
                  </div>

                  {project.cards.length < 1 && (
                    <Button
                      type="button"
                      disabled={isCreateCardBtnLoading}
                      onClick={() => {
                        // setIsCreateCardModalOpen(true);

                        setIsCCBLoading(true);

                        request<ProjectCard>({
                          url: `/api/projects/${project.id}/create-card`,
                          method: "POST",
                        })
                          .then(({data}: any) => {
                            setProject({
                              ...project,
                              cards: [...project.cards, data],
                            });
                          })
                          .finally(() => {
                            setIsCCBLoading(false);
                          });
                      }}
                      className="h-fit"
                    >
                      {isCreateCardBtnLoading ? "Loading..." : "Create card"}
                    </Button>
                  )}
                </div>

                <div className="w-[100%] h-[2px] bg-paper-contrast/25" />

                <div className="flex justify-between flex-wrap -my-4">
                  {project.cards.map((card, idx) => (
                    <div
                      key={idx}
                      className="w-[47.5%] min-h-[12rem] bg-paper rounded-lg shadow-md relative p-6 my-4"
                    >
                      {card.members.map((m) => (
                        <Button key={m.id} disabled className="m-1">
                          {m.role}
                        </Button>
                      ))}

                      {card.members.length < card.slots ? (
                        <Button
                          type="button"
                          onClick={() => {
                            setAddPersonModal({
                              open: true,
                              cardId: card.id,
                              projectId: project.id,
                            });
                          }}
                          className="inline-flex items-center m-1"
                        >
                          <span>Add person</span>

                          <span className="rounded-full border border-paper ml-3">
                            <BsPlus className="w-5 h-auto" />
                          </span>
                        </Button>
                      ) : card.slots < 4 ? (
                        <Button
                          type="button"
                          onClick={() => {
                            setAddSlotsModal({
                              open: true,
                              availableSlots: 4 - card.slots,
                              cardId: card.id,
                              projectId: project.id,
                            });
                          }}
                          className="inline-flex items-center m-1"
                        >
                          <span>Add slots</span>

                          <span className="rounded-full border border-paper ml-3">
                            <BsPlus className="w-5 h-auto" />
                          </span>
                        </Button>
                      ) : null}

                      <span className="text-sm text-paper-contrast/40 font-semibold absolute right-4 bottom-4">
                        ({card.members.length}/{card.slots})
                      </span>
                    </div>
                  ))}
                </div> */}

                <div className="w-full flex justify-end">
                  <div className="flex items-center space-x-4">
                    <Link href={`/projects/${project?.id}`}>
                      <Button color="secondary" type="button">
                        Cancel
                      </Button>
                    </Link>

                    <Button type="submit" disabled={!isValid}>
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </ContentTemplate>
    </>
  );
};

const CreateCardModal: React.FC<ModalWindowPropsWithClose> = ({close}) => {
  const {
    control,
    handleSubmit,
    formState: {isValid},
  } = useForm<{
    members: Nullable<number>;
  }>({
    defaultValues: {
      members: null,
    },
  });

  return (
    <Modal.Window close={close} title="Create card">
      <div className="flex flex-col">
        <form
          onSubmit={handleSubmit((form) => {
            console.log(form);
          })}
          className="flex flex-col space-y-16"
        >
          <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-paper-contrast/75 font-semibold">
                Creating 1st card
              </span>

              <span className="text-accent text-lg font-bold">free</span>
            </div>

            <Controller
              name="members"
              control={control}
              render={({field}) => (
                <Radio.Root
                  name="members"
                  onValueChange={field.onChange}
                  value={field.value ? String(field.value) : undefined}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <Radio.Item value="1">1 member</Radio.Item>

                    <span className="text-accent font-bold">2000 KZT</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <Radio.Item value="2">2 members</Radio.Item>

                    <span className="text-accent font-bold">4000 KZT</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <Radio.Item value="3">3 members</Radio.Item>

                    <span className="text-accent font-bold">6000 KZT</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <Radio.Item value="4">4 members</Radio.Item>

                    <span className="text-accent font-bold">8000 KZT</span>
                  </div>
                </Radio.Root>
              )}
            />
          </div>

          <div className="flex justify-between items-center">
            <Modal.Close>
              <Button color="secondary">Cancel</Button>
            </Modal.Close>

            <Button disabled={!isValid} type="submit">
              Create card
            </Button>
          </div>
        </form>
      </div>
    </Modal.Window>
  );
};

const AddPersonModal: React.FC<ModalWindowPropsWithClose> = ({close}) => {
  const {
    register,
    handleSubmit,
    formState: {isValid, errors},
  } = useForm<{
    role: string;
    requirements: string;
    benefits: string;
  }>({
    defaultValues: {
      role: "",
      requirements: "",
      benefits: "",
    },
  });

  return (
    <Modal.Window
      close={close}
      title="Add person"
      description="Please, be sure! You have only one chance to apply a new specialist 😉"
    >
      <div className="flex flex-col">
        <form
          className="flex flex-col space-y-10"
          onSubmit={handleSubmit((form) => {
            console.log(form);
          })}
        >
          <div className="flex flex-col space-y-4">
            <TextField
              {...register("role")}
              placeholder="Role"
              className="h-auto"
            />

            <Textarea
              {...register("requirements", {
                required: true,
              })}
              placeholder="Requirements"
              error={errors.requirements?.message}
            />

            <TextField
              {...register("benefits")}
              placeholder="Benefits for member"
              className="h-auto"
            />
          </div>

          <div className="flex justify-between items-center">
            <Modal.Close>
              <Button color="secondary">Cancel</Button>
            </Modal.Close>

            <Button disabled={!isValid} type="submit">
              Confirm
            </Button>
          </div>
        </form>
      </div>
    </Modal.Window>
  );
};

interface AddSlotsModalProps extends ModalWindowPropsWithClose {
  availableSlots: number;
}

const AddSlotsModal: React.FC<AddSlotsModalProps> = ({
  close,
  availableSlots,
}) => {
  const {control, handleSubmit} = useForm<{
    slots: Nullable<number>;
  }>({
    defaultValues: {
      slots: null,
    },
  });

  return (
    <Modal.Window close={close} title="Add new slots">
      <div className="flex flex-col">
        <form
          onSubmit={handleSubmit((form) => {
            console.log(form);
          })}
          className="flex flex-col space-y-14"
        >
          <div className="flex flex-col">
            <Controller
              name="slots"
              control={control}
              render={({field}) => (
                <Radio.Root
                  name="members"
                  onValueChange={field.onChange}
                  value={field.value ? String(field.value) : undefined}
                  className="space-y-4"
                >
                  {Array.from({length: availableSlots}).map((_, idx) => {
                    const slots = idx + 1;
                    const stringified = slots.toString();

                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between"
                      >
                        <Radio.Item value={stringified}>
                          {stringified} slots
                        </Radio.Item>

                        <span className="text-accent font-bold">
                          {2000 * slots} KZT
                        </span>
                      </div>
                    );
                  })}
                </Radio.Root>
              )}
            />
          </div>

          <div className="flex justify-between items-center">
            <Modal.Close>
              <Button color="secondary">Cancel</Button>
            </Modal.Close>

            <Button type="submit">To payment</Button>
          </div>
        </form>
      </div>
    </Modal.Window>
  );
};
