import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";

import {Button, Checkbox, H2, TextField, Link} from "@shared/ui";
import {AuthenticationTemplate} from "@features/auth";

export const SignInPage: React.FC = () => {
  const {t} = useTranslation();

  return (
    <AuthenticationTemplate>
      <div className="w-[25rem] flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <H2>{t("common.sign-in")}</H2>

          <span className="text-paper-contrast/70">
            {t("common.sign-in-subtitle")}
          </span>
        </div>

        <SignInForm />

        <div className="flex flex-col text-left">
          <div className="flex space-x-2">
            <span className="text-paper-contrast/80">
              Don't have an account?
            </span>
            <Link href="/sign-up">Sign up</Link>
          </div>

          <Link href="/password-recovery">Forgot password</Link>
        </div>
      </div>
    </AuthenticationTemplate>
  );
};

interface SignInForm {
  email: string;
  password: string;
  remember: boolean;
}

const SignInForm: React.FC = () => {
  const {t} = useTranslation();

  const {register, handleSubmit} = useForm<SignInForm>({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onFormSubmit = handleSubmit((form) => {
    console.log(form);
  });

  return (
    <form onSubmit={onFormSubmit} className="flex flex-col">
      <div>
        <TextField
          {...register("email")}
          type="email"
          label="Email address"
          placeholder="Email"
        />

        <TextField
          {...register("password")}
          type="password"
          label="Password"
          placeholder="Password"
        />
      </div>

      <div className="flex flex-col space-y-6">
        <Checkbox {...register("remember")} label="Remember me" />

        <Button type="submit">{t("common.sign-in")}</Button>
      </div>
    </form>
  );
};
