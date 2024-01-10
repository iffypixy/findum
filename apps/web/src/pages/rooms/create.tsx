import {Controller, useForm} from "react-hook-form";
import {twMerge} from "tailwind-merge";
import {useState} from "react";
import {useTranslation} from "react-i18next";

import {
  Button,
  ContentTemplate,
  DatePicker,
  H3,
  H4,
  Icon,
  Select,
  TextField,
  Textarea,
  Upload,
  Radio,
  Avatar,
} from "@shared/ui";
import {countries} from "@shared/lib/location";
import {Location, Nullable} from "@shared/lib/types";
import {Modal, WrappedModalProps} from "@shared/lib/modal";
import {AvatarEditor} from "@shared/lib/avatars";
import {useDispatch} from "@shared/lib/store";
import {projectsModel} from "@features/projects";
import {navigate} from "wouter/use-location";
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
}

interface AvatarEditorData {
  open: boolean;
  avatar: Nullable<File>;
}

export const CreateRoomPage: React.FC = () => {
  const dispatch = useDispatch();

  const {t} = useTranslation();

  const [isCreateCardModalOpen, setIsCreateCardModalOpen] = useState(false);
  const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState(false);

  const [addSlotsModal, setAddSlotsModal] = useState<AddSlotsModalData>({
    open: false,
    availableSlots: null,
  });

  const [avatarEditor, setAvatarEditor] = useState<AvatarEditorData>({
    open: false,
    avatar: null,
  });

  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    formState: {isValid},
  } = useForm<CreateRoomForm>({
    defaultValues: {
      name: "",
      description: "",
      startDate: null,
      endDate: null,
      avatar: null,
    },
  });

  const avatar = watch("avatar");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  return (
    <>
      {avatarEditor.open && (
        <AvatarEditor
          image={URL.createObjectURL(avatarEditor.avatar!)}
          open={avatarEditor.open}
          onSave={(blob) => {
            if (blob) {
              api.upload
                .uploadImage({
                  image: blob as File,
                })
                .then(({url}) => {
                  // @ts-ignore
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
            <H3>{t("common.create-project")}</H3>

            <span className="text-paper-contrast/40">
              {t("common.create-project-subtitle")}
            </span>
          </div>

          <form
            onSubmit={handleSubmit((form) => {
              if (
                !form.name ||
                !form.description ||
                !form.location ||
                !form.startDate ||
                !form.endDate
              )
                return;

              dispatch(
                projectsModel.actions.createProject({
                  name: form.name,
                  description: form.description,
                  avatar: avatar || undefined,
                  location: {
                    country: form.location.country,
                    city: form.location.city,
                  },
                  startDate: new Date(form.startDate),
                  endDate: new Date(form.endDate),
                }),
              )
                .unwrap()
                .then((res) => {
                  navigate(`/projects/${res.project.id}`);

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
                    {...register("name", {required: true})}
                    placeholder="Name"
                    className="h-auto"
                  />
                  <Textarea
                    {...register("description", {required: true})}
                    placeholder="Description"
                  />
                </div>

                <div className="flex flex-col w-[100%] space-y-4">
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
                    <H6>Cards</H6>

                    <span className="text-sm text-paper-contrast/40">
                      You may create up to 3 cards in one room
                    </span>
                  </div>

                  <Button
                    onClick={() => {
                      setIsCreateCardModalOpen(true);
                    }}
                    className="h-fit"
                  >
                    Create card
                  </Button>
                </div>

                <div className="w-[100%] h-[2px] bg-paper-contrast/25" />

                <div className="flex justify-between flex-wrap -my-4">
                  {Array.from({length: 0}).map((_, idx) => (
                    <div
                      key={idx}
                      className="w-[47.5%] min-h-[12rem] bg-paper rounded-lg shadow-md relative p-6 my-4"
                    >
                      {Math.ceil(Math.random() * 10) % 2 === 0 ? (
                        <Button
                          onClick={() => {
                            setIsAddPersonModalOpen(true);
                          }}
                          className="inline-flex items-center text-sm"
                        >
                          <span>Add person</span>

                          <span className="rounded-full border border-paper ml-3">
                            <BsPlus className="w-5 h-auto" />
                          </span>
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            setAddSlotsModal({
                              open: true,
                              availableSlots: 3,
                            });
                          }}
                          className="inline-flex items-center text-sm"
                        >
                          <span>Add slots</span>

                          <span className="rounded-full border border-paper ml-3">
                            <BsPlus className="w-5 h-auto" />
                          </span>
                        </Button>
                      )}

                      <span className="text-sm text-paper-contrast/40 font-semibold absolute right-4 bottom-4">
                        (0/4)
                      </span>
                    </div>
                  ))}
                </div> */}

                <div className="w-[100%] flex justify-end">
                  <div className="flex items-center space-x-4">
                    <Button>Cancel</Button>
                    <Button type="submit" disabled={!isValid}>
                      Create room
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </ContentTemplate>

      <CreateCardModal
        open={isCreateCardModalOpen}
        onClose={() => {
          setIsCreateCardModalOpen(false);
        }}
      />

      <AddPersonModal
        open={isAddPersonModalOpen}
        onClose={() => {
          setIsAddPersonModalOpen(false);
        }}
      />

      <AddSlotsModal
        availableSlots={addSlotsModal.availableSlots!}
        open={addSlotsModal.open}
        onClose={() => {
          setAddSlotsModal({
            open: false,
            availableSlots: null,
          });
        }}
      />
    </>
  );
};

interface CreateCardForm {
  members: Nullable<string>;
}

const CreateCardModal: React.FC<WrappedModalProps> = ({onClose, open}) => {
  const {control, handleSubmit} = useForm<CreateCardForm>({
    defaultValues: {
      members: null,
    },
  });

  return (
    <Modal onClose={onClose} open={open}>
      <div className="w-[30rem] flex flex-col space-y-16 bg-paper rounded-lg shadow-md p-10">
        <H4>Create a card</H4>

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

interface AddPersonForm {
  specialist: string;
  requirements: string;
  benefits: string;
}

const AddPersonModal: React.FC<WrappedModalProps> = ({open, onClose}) => {
  const {register} = useForm<AddPersonForm>({
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

        <form className="flex flex-col space-y-10">
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
            <Button onClick={() => navigate("/")}>Cancel</Button>
            <Button type="submit">Confirm</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

interface AddSlotsModalProps extends WrappedModalProps {
  availableSlots: number;
}

interface AddSlotsForm {
  slots: Nullable<string>;
}

const AddSlotsModal: React.FC<AddSlotsModalProps> = ({
  open,
  onClose,
  availableSlots,
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
            <Button>Cancel</Button>

            <Button
              type="submit"
              onClick={() => {
                window.Robokassa.StartPayment({
                  MerchantLogin: "Test1999",
                  Pass1: "Пароль#1",
                  OutSum: 100,
                  InvId: 678678,
                  Description: "Оплата заказа в Тестовом магазине ROBOKASSA",
                  Shp_Item: "1",
                  Culture: "ru",
                  Encoding: "utf-8",
                  SignatureValue: "dsfsdf",
                  IsTest: 1,
                });
              }}
            >
              To payment
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
