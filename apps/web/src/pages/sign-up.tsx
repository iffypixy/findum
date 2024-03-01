import {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {cx} from "class-variance-authority";
import {twMerge} from "tailwind-merge";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Trans, useTranslation} from "react-i18next";

import {useSignUp, AuthenticationTemplate} from "@features/auth";
import {Button, H2, TextField, Select, Link, H3} from "@shared/ui";
import {countries} from "@shared/lib/location";
import {Location} from "@shared/lib/types";

interface SignUpForm {
  step1: Step1Form;
  step2: Step2Form;
}

export const SignUpPage: React.FC = () => {
  const {t} = useTranslation();

  const {signUp, isSuccess} = useSignUp();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Partial<SignUpForm>>({});

  const signedUp = isSuccess;

  if (signedUp) return <SignUpConfirmation />;

  const TOTAL_STEPS = 2;

  const step1Form = (
    <Step1Form
      onConfirm={(data) => {
        setStep(step + 1);

        setForm({...form, step1: data});
      }}
    />
  );

  const step2Form = (
    <Step2Form
      onConfirm={(data) => {
        const step1 = form.step1!;

        signUp({
          email: data.email,
          password: data.password1,
          firstName: step1.firstName,
          lastName: step1.lastName,
          location: step1.location,
        });
      }}
    />
  );

  const currentForm = [step1Form, step2Form][step];

  return (
    <AuthenticationTemplate>
      <div className="w-[25rem] flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <H2 className="text-[#112042]">{t("sign-up.title")}</H2>

          <span className="text-[#817C7C]">{t("sign-up.subtitle")}</span>
        </div>

        <div className="flex">
          {Array.from({length: TOTAL_STEPS}).map((_, idx) => (
            <div
              key={idx}
              style={{
                width: `${100 / TOTAL_STEPS}%`,
              }}
              className={twMerge(
                cx(
                  "flex items-center justify-center border-b-2 border-current py-2",
                  {
                    "text-[#112042]": step === idx,
                    "text-[#E9E4E4]": step !== idx,
                  },
                ),
              )}
            >
              <span className="text-current text-lg font-semibold">
                {t("common.step")} {idx + 1}
              </span>
            </div>
          ))}
        </div>

        {currentForm}

        <div className="flex space-x-1">
          <span className="text-[#817C7C]">
            <Trans
              i18nKey="sign-up.helpers.sign-in"
              components={[<Link href="/sign-in" />]}
            />
          </span>
        </div>
      </div>
    </AuthenticationTemplate>
  );
};

const schema = {
  step1: z.object({
    firstName: z.string().min(2).max(64),
    lastName: z.string().min(2).max(64),
    location: z.object({
      country: z.string().min(2).max(64),
      city: z.string().min(2).max(64),
    }),
  }),
  step2: z
    .object({
      email: z.string().email(),
      password1: z.string().min(8).max(256),
      password2: z.string(),
    })
    .refine((data) => data.password1 === data.password2, {
      message: "Passwords do not match",
      path: ["password2"],
    }),
};

interface InterimFormProps<T> {
  onConfirm: (form: T) => void;
}

interface Step1Form {
  firstName: string;
  lastName: string;
  location: Location;
}

const Step1Form: React.FC<InterimFormProps<Step1Form>> = (props) => {
  const {
    handleSubmit,
    register,
    control,
    formState: {isValid},
  } = useForm<Step1Form>({
    mode: "onChange",
    resolver: zodResolver(schema.step1),
  });

  const {t} = useTranslation();

  return (
    <form
      onSubmit={handleSubmit(props.onConfirm)}
      className="flex flex-col space-y-4"
    >
      <div>
        <TextField
          label={t("common.fields.first-name")}
          placeholder={t("sign-up.placeholders.first-name")}
          type="text"
          {...register("firstName")}
        />

        <TextField
          label={t("common.fields.last-name")}
          placeholder={t("sign-up.placeholders.last-name")}
          type="text"
          {...register("lastName")}
        />

        <Controller
          name="location.country"
          control={control}
          render={({field: {name, onChange, value, disabled}}) => (
            <Select.Root
              name={name}
              value={value}
              placeholder={t("sign-up.placeholders.country")}
              label={t("common.fields.country")}
              onValueChange={onChange}
              disabled={disabled}
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
          label={t("common.fields.city")}
          placeholder={t("sign-up.placeholders.city")}
          type="text"
          {...register("location.city")}
        />
      </div>

      <Button type="submit" disabled={!isValid}>
        Next (1/2)
      </Button>
    </form>
  );
};

interface Step2Form {
  email: string;
  password1: string;
  password2: string;
}

const Step2Form: React.FC<InterimFormProps<Step2Form>> = (props) => {
  const {
    handleSubmit,
    register,
    formState: {isValid},
  } = useForm<Step2Form>({
    mode: "onChange",
    resolver: zodResolver(schema.step2),
  });

  const [showPassword, setShowPassword] = useState({
    password1: false,
    password2: false,
  });

  return (
    <form
      onSubmit={handleSubmit(props.onConfirm)}
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
              type="button"
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
              type="button"
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
        Sign up
      </Button>
    </form>
  );
};

const SignUpConfirmation: React.FC = () => {
  const {t} = useTranslation();

  return (
    <AuthenticationTemplate>
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-2">
          <H3>{t("sign-up.success.title")}</H3>
          <span className="text-paper-contrast/60 text-lg">
            {t("sign-up.success.subtitle")}
          </span>
        </div>
      </div>
    </AuthenticationTemplate>
  );
};
