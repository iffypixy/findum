import {Controller, useForm} from "react-hook-form";
import {twMerge} from "tailwind-merge";
import {useEffect, useState} from "react";
import {BsPlus} from "react-icons/bs";
import {useLocation} from "wouter";

import {
  Button,
  ContentTemplate,
  DatePicker,
  H3,
  H4,
  H6,
  Icon,
  Select,
  TextField,
  Textarea,
  Upload,
  Radio,
  Avatar,
} from "@shared/ui";
import {countries} from "@shared/lib/location";
import {Location, Nullable, Project, ProjectMember} from "@shared/lib/types";
import {Modal, WrappedModalProps} from "@shared/lib/modal";
import {AvatarEditor} from "@shared/lib/avatars";
import {useParams} from "wouter";
import {api} from "@shared/api";
import toast from "react-hot-toast";

interface CreateRoomForm {
  name: string;
  description: string;
  startDate: Nullable<Date>;
  endDate: Nullable<Date>;
  avatar: Nullable<string>;
  location: Nullable<Location>;
}

interface AddSlotsModalData {
  open: boolean;
  availableSlots: Nullable<number>;
  cardId: Nullable<string>;
  projectId: Nullable<string>;
}

interface AvatarEditorData {
  open: boolean;
  avatar: Nullable<File>;
}

export const EditProjectPage: React.FC = () => {
  const [isCreateCardModalOpen, setIsCreateCardModalOpen] = useState(false);
  const [addPersonModal, setAddPersonModal] = useState<{
    open: boolean;
    cardId: Nullable<string>;
    projectId: Nullable<string>;
  }>({
    open: false,
    cardId: null,
    projectId: null,
  });

  const {id} = useParams() as {id: string};

  const [project, setProject] = useState<Nullable<Project>>(null);

  const [, navigate] = useLocation();

  useEffect(() => {
    api.projects.getProject({id}).then(({data}) => setProject(data.project));
  }, []);

  const [addSlotsModal, setAddSlotsModal] = useState<AddSlotsModalData>({
    open: false,
    availableSlots: null,
    cardId: null,
    projectId: null,
  });

  const [avatarEditor, setAvatarEditor] = useState<AvatarEditorData>({
    open: false,
    avatar: null,
  });

  const {register, control, watch, handleSubmit, setValue} =
    useForm<CreateRoomForm>({
      values: {
        name: project?.name || "",
        description: project?.description || "",
        startDate: project?.startDate || null,
        endDate: project?.endDate || null,
        avatar: project?.avatar || null,
        location: project?.location || null,
      },
    });

  const avatar = watch("avatar");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  if (!project) return null;

  return (
    <>
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

      <ContentTemplate>
        <div className="w-[100%] h-[100%] flex flex-col bg-paper-brand">
          <div className="flex flex-col bg-paper space-y-2 p-8">
            <H3>Edit project</H3>

            <span className="text-paper-contrast/40">
              Build up your team to realize startup project
            </span>
          </div>

          <form
            onSubmit={handleSubmit((form) => {
              api.projects
                .editProject({
                  id: project.id,
                  description: form.description,
                  avatar: form.avatar!,
                  endDate: form.endDate || undefined,
                  startDate: form.startDate || undefined,
                  location: form.location || undefined,
                  name: form.name,
                })

                .then(() => {
                  navigate(`/projects/${project.id}`);

                  toast.success("Successfully created a project :)");
                })
                .catch(() => {
                  toast.error("Something's wrong :(");
                });
            })}
            className="bg-paper-brand"
          >
            <div className="space-y-8 p-8">
              <div className="flex space-x-4 items-end">
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
              </div>

              <div className="flex items-center space-x-14">
                <div className="flex flex-col w-[100%] space-y-4">
                  <TextField
                    {...register("name")}
                    placeholder="Name"
                    className="h-auto"
                  />
                  <Textarea
                    {...register("description")}
                    placeholder="Description"
                  />
                </div>

                <div className="flex flex-col w-[100%] space-y-4">
                  <div className="flex items-center space-x-4">
                    {project && (
                      <Controller
                        name="startDate"
                        control={control}
                        render={({field}) => (
                          <DatePicker
                            initialValue={project.startDate}
                            label="Start date"
                            toDate={endDate || project.endDate}
                            onSelect={(date) => field.onChange(date)}
                          />
                        )}
                      />
                    )}

                    {project && (
                      <Controller
                        name="endDate"
                        control={control}
                        render={({field}) => (
                          <DatePicker
                            initialValue={project.endDate}
                            label="End date"
                            fromDate={startDate || project.startDate}
                            onSelect={(date) => field.onChange(date)}
                          />
                        )}
                      />
                    )}
                  </div>

                  <Controller
                    name="location.country"
                    control={control}
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
                    {...register("location.city")}
                    placeholder="City"
                    className="h-auto"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <div className="flex justify-between">
                  <div className="flex flex-col space-y-2">
                    <H6>Cards ({project.cards.length}/4)</H6>

                    <span className="text-sm text-paper-contrast/40">
                      You may create up to 4 cards in one room
                    </span>
                  </div>

                  {project.cards.length < 4 && (
                    <Button
                      type="button"
                      onClick={() => {
                        setIsCreateCardModalOpen(true);
                      }}
                      className="h-fit"
                    >
                      Create card
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
                </div>

                <div className="w-[100%] flex justify-end">
                  <div className="flex items-center space-x-4">
                    <Button>Cancel</Button>
                    <Button type="submit">Save all changes</Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </ContentTemplate>

      <CreateCardModal
        number={project.cards.length + 1}
        projectId={project.id}
        open={isCreateCardModalOpen}
        onClose={() => {
          setIsCreateCardModalOpen(false);
        }}
      />

      <AddPersonModal
        open={addPersonModal.open}
        cardId={addPersonModal.cardId!}
        projectId={addPersonModal.projectId!}
        onFinish={(m) => {
          setProject({
            ...project,
            cards: project.cards.map((c) =>
              addPersonModal.cardId === c.id
                ? {...c, members: [...c.members, m]}
                : c,
            ),
          });

          setAddPersonModal({
            open: false,
            cardId: null,
            projectId: null,
          });
        }}
        onClose={() => {
          setAddPersonModal({
            open: false,
            cardId: null,
            projectId: null,
          });
        }}
      />

      <AddSlotsModal
        availableSlots={addSlotsModal.availableSlots!}
        cardId={addSlotsModal.cardId!}
        projectId={addSlotsModal.projectId!}
        open={addSlotsModal.open}
        onClose={() => {
          setAddSlotsModal({
            open: false,
            availableSlots: null,
            cardId: null,
            projectId: null,
          });
        }}
      />
    </>
  );
};

interface CreateCardModalProps {
  number: number;
  projectId: string;
}

interface CreateCardForm {
  members: Nullable<string>;
}

const CreateCardModal: React.FC<WrappedModalProps & CreateCardModalProps> = ({
  onClose,
  open,
  projectId,
  number,
}) => {
  const {control, handleSubmit} = useForm<CreateCardForm>({
    defaultValues: {
      members: null,
    },
  });

  const prices = [0, 2100, 5000, 10000];

  return (
    <Modal onClose={onClose} open={open}>
      <div className="w-[30rem] flex flex-col space-y-16 bg-paper rounded-lg shadow-md p-10">
        <H4>Create a card</H4>

        <form
          onSubmit={handleSubmit((form) => {
            api.projects
              .createProjectCard({
                projectId: projectId,
                slots: +form.members!,
              })
              .then(({data}) => {
                window.location.replace(data.paymentUrl);
              });
          })}
          className="flex flex-col space-y-16"
        >
          <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-paper-contrast/75 font-semibold">
                Creating card number {number}
              </span>

              <span className="text-accent text-lg font-bold">
                {number === 1 ? "free" : `${prices[number - 1]} KZT`}
              </span>
            </div>

            <Controller
              name="members"
              control={control}
              render={({field}) => (
                <Radio.Root
                  name="members"
                  onValueChange={field.onChange}
                  value={field.value || undefined}
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
            <Button>Cancel</Button>

            <Button type="submit">Create card</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

interface AddPersonModalProps extends WrappedModalProps {
  cardId: string;
  projectId: string;
}

interface AddPersonForm {
  specialist: string;
  requirements: string;
  benefits: string;
}

const AddPersonModal: React.FC<
  AddPersonModalProps & {onFinish: (member: ProjectMember) => void}
> = ({open, onClose, ...props}) => {
  const {register, handleSubmit} = useForm<AddPersonForm>({
    defaultValues: {
      specialist: "",
      requirements: "",
      benefits: "",
    },
  });

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-[30rem] flex flex-col space-y-10 bg-paper rounded-lg shadow-md p-10">
        <div className="flex flex-col space-y-2">
          <H4>Add a person</H4>

          <p className="text-paper-contrast/40">
            Please, be sure! You have only one chance to apply a new specialist
            😉
          </p>
        </div>

        <form
          onSubmit={handleSubmit((form) => {
            api.projects
              .createProjectMember({
                benefits: form.benefits,
                requirements: form.requirements,
                role: form.specialist,
                cardId: props.cardId,
                projectId: props.projectId,
              })
              .then(({data}) => {
                toast.success("You successfully created a project member");

                props.onFinish(data.member);
              })
              .catch(() => {
                toast.error("Something's wrong");
              });
          })}
          className="flex flex-col space-y-10"
        >
          <div className="flex flex-col space-y-4">
            <TextField
              {...register("specialist")}
              placeholder="Specialist"
              className="h-auto"
            />

            <Textarea
              {...register("requirements")}
              placeholder="Requirements"
              maxWords={150}
            />

            <TextField
              {...register("benefits")}
              placeholder="Benefits for member"
              className="h-auto"
            />
          </div>

          <div className="flex justify-between items-center">
            <Button type="button">Cancel</Button>
            <Button type="submit">Confirm</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

interface AddSlotsModalProps extends WrappedModalProps {
  availableSlots: number;
  cardId: string;
  projectId: string;
}

interface AddSlotsForm {
  slots: Nullable<string>;
}

const AddSlotsModal: React.FC<AddSlotsModalProps> = ({
  open,
  onClose,
  availableSlots,
  ...props
}) => {
  const {control, handleSubmit} = useForm<AddSlotsForm>({
    defaultValues: {
      slots: null,
    },
  });

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-[25rem] flex flex-col space-y-14 bg-paper rounded-lg shadow-md p-10">
        <H4>Add new slots</H4>

        <form
          onSubmit={handleSubmit((form) => {
            if (form.slots) {
              api.projects
                .addCardSlots({
                  cardId: props.cardId,
                  projectId: props.projectId,
                  slots: +form.slots!,
                })
                .then(({data}) => {
                  window.location.href = data.paymentUrl;
                });
            }
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
                  value={field.value || undefined}
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
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit">To payment</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
