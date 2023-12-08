import {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {cx} from "class-variance-authority";
import {twMerge} from "tailwind-merge";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

import {Button, H2, TextField, UploadField, Select, Link, H3} from "@shared/ui";
import {cities} from "@shared/lib/cities";
import {AuthenticationTemplate} from "@features/auth";

interface SignUpForm {
  stage1: Stage1Form;
  stage2: Stage2Form;
  stage3: Stage3Form;
}

export const SignUpPage: React.FC = () => {
  const [stage, setStage] = useState(0);
  const [form, setForm] = useState<Partial<SignUpForm>>({});
  const [signedUp] = useState(false);

  return (
    <AuthenticationTemplate>
      {signedUp ? (
        <SignUpConfirmation />
      ) : (
        <div className="w-[25rem] flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <H2>Sign up</H2>

            <span className="text-paper-contrast/70">
              Please enter your data to sign up
            </span>
          </div>

          <div className="flex">
            <span
              className={twMerge(
                cx(
                  "inline-flex justify-center w-[33.3%] py-[2%] border-b-2 text-main/30 text-lg font-semibold border-main/30",
                  {
                    "text-main border-main": stage === 0,
                  },
                ),
              )}
            >
              Step 1
            </span>

            <span
              className={twMerge(
                cx(
                  "inline-flex justify-center w-[33.3%] py-[2%] border-b-2 text-main/30 text-lg font-semibold border-main/30",
                  {
                    "text-main border-main": stage === 1,
                  },
                ),
              )}
            >
              Step 2
            </span>

            <span
              className={twMerge(
                cx(
                  "inline-flex justify-center w-[33.3%] py-[2%] border-b-2 text-main-500/30 text-lg font-semibold border-main/30",
                  {
                    "text-main border-main": stage === 2,
                  },
                ),
              )}
            >
              Step 3
            </span>
          </div>

          {stage === 0 ? (
            <Stage1
              onSubmit={(data) => {
                setStage(1);

                setForm({...form, stage1: data});
              }}
            />
          ) : stage === 1 ? (
            <Stage2
              onSubmit={(data) => {
                setStage(2);

                setForm({...form, stage2: data});
              }}
            />
          ) : stage === 2 ? (
            <Stage3
              onSubmit={(data) => {
                setForm({...form, stage3: data});

                console.log(form);
              }}
            />
          ) : null}

          <div className="flex space-x-1">
            <span>Do you already have an account?</span>
            <Link href="/sign-in">Sign in</Link>
          </div>
        </div>
      )}
    </AuthenticationTemplate>
  );
};

type InterimFormProps<T> = {
  onSubmit: (form: T) => void;
};

interface Stage1Form {
  firstName: string;
  lastName: string;
  location: string;
}

const validationSchemas = {
  stage1: z.object({
    firstName: z.string().min(2).max(64),
    lastName: z.string().min(2).max(64),
    location: z.string().min(2).max(64),
  }),
  stage2: z
    .object({
      email: z.string().email(),
      password1: z.string().min(8).max(256),
      password2: z.string(),
    })
    .refine((data) => data.password1 === data.password2, {
      message: "Passwords do not match",
      path: ["password2"],
    }),
  stage3: z.object({
    role1: z.string().min(1).max(64),
    role2: z.string().min(1).max(64),
    role3: z.string().min(1).max(64),
    cv: z.instanceof(File),
  }),
};

const Stage1: React.FC<InterimFormProps<Stage1Form>> = (props) => {
  const {
    handleSubmit,
    register,
    control,
    formState: {isValid},
  } = useForm<Stage1Form>({
    mode: "onChange",
    resolver: zodResolver(validationSchemas.stage1),
  });

  return (
    <form
      onSubmit={handleSubmit((form) => {
        if (isValid) {
          props.onSubmit(form);
        }
      })}
      className="flex flex-col space-y-4"
    >
      <div>
        <TextField
          label="First name"
          placeholder="First name"
          type="text"
          {...register("firstName")}
        />

        <TextField
          label="Last name"
          placeholder="Last name"
          type="text"
          {...register("lastName")}
        />

        <Controller
          name="location"
          control={control}
          render={({field}) => (
            <Select.Root
              placeholder="Select a location"
              label="Location"
              onValueChange={field.onChange}
              {...field}
            >
              {cities.map((city) => (
                <Select.Item value={city}>{city}</Select.Item>
              ))}
            </Select.Root>
          )}
        />
      </div>

      <Button type="submit" disabled={!isValid}>
        Next (1/3)
      </Button>
    </form>
  );
};

interface Stage2Form {
  email: string;
  password1: string;
  password2: string;
}

const Stage2: React.FC<InterimFormProps<Stage2Form>> = (props) => {
  const {
    handleSubmit,
    register,
    formState: {isValid},
  } = useForm<Stage2Form>({
    mode: "onChange",
    resolver: zodResolver(validationSchemas.stage2),
  });

  const [showPassword, setShowPassword] = useState({
    password1: false,
    password2: false,
  });

  return (
    <form
      onSubmit={handleSubmit((form) => {
        if (isValid) {
          props.onSubmit(form);
        }
      })}
      className="flex flex-col space-y-4"
    >
      <div>
        <TextField
          label="Email"
          placeholder="metaorta@gmail.com"
          type="email"
          {...register("email")}
        />

        <TextField
          label="Password"
          placeholder="*********"
          type={showPassword.password1 ? "text" : "password"}
          suffix={
            <button
              onClick={() => {
                setShowPassword({
                  ...showPassword,
                  password1: !showPassword.password1,
                });
              }}
            >
              {showPassword.password1 ? (
                <AiOutlineEyeInvisible />
              ) : (
                <AiOutlineEye />
              )}
            </button>
          }
          {...register("password1")}
        />

        <TextField
          label="Password confirmation"
          placeholder="*********"
          type={showPassword.password2 ? "text" : "password"}
          suffix={
            <button
              onClick={() => {
                setShowPassword({
                  ...showPassword,
                  password2: !showPassword.password2,
                });
              }}
            >
              {showPassword.password2 ? (
                <AiOutlineEyeInvisible />
              ) : (
                <AiOutlineEye />
              )}
            </button>
          }
          {...register("password2")}
        />
      </div>

      <Button type="submit" disabled={!isValid}>
        Next (2/3)
      </Button>
    </form>
  );
};

interface Stage3Form {
  role1: string;
  role2: string;
  role3: string;
  cv: File;
}

const Stage3: React.FC<InterimFormProps<Stage3Form>> = (props) => {
  const {
    handleSubmit,
    register,
    control,
    formState: {isValid},
  } = useForm<Stage3Form>({
    mode: "onChange",
    resolver: zodResolver(validationSchemas.stage3),
  });

  return (
    <form
      onSubmit={handleSubmit((form) => {
        console.log(form);

        if (isValid) {
          props.onSubmit(form);
        }
      })}
      className="flex flex-col space-y-4"
    >
      <div>
        <TextField
          {...register("role1")}
          label="1st role"
          placeholder="1st role"
          type="text"
        />

        <TextField
          {...register("role2")}
          label="2nd role"
          placeholder="2nd role"
          type="text"
        />

        <TextField
          {...register("role3")}
          label="3rd role"
          placeholder="3rd role"
          type="text"
        />

        <Controller
          name="cv"
          control={control}
          render={({field}) => (
            <UploadField
              {...field}
              value={undefined}
              label="CV (.pdf)"
              placeholder="cv.pdf"
              onChange={(event) => {
                field.onChange(event.target.files![0]);
              }}
            />
          )}
        />
      </div>

      <Button type="submit" disabled={!isValid}>
        Sign up
      </Button>
    </form>
  );
};

const SignUpConfirmation: React.FC = () => {
  return (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-col space-y-2">
        <H3>Thank you for signing up!</H3>
        <span className="text-paper-contrast/60 text-lg">
          Check your mailbox
        </span>
      </div>

      <Button className="w-fit">Back</Button>
    </div>
  );
};
