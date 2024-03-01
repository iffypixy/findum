import {useForm} from "react-hook-form";
import {Trans, useTranslation} from "react-i18next";

import {Button, Checkbox, H2, TextField, Link} from "@shared/ui";
import {AuthenticationTemplate} from "@features/auth";
import {useSignIn} from "@features/auth";

export const SignInPage: React.FC = () => {
  const {t} = useTranslation();

  return (
    <AuthenticationTemplate>
      <div className="w-[25rem] flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <H2>{t("sign-in.title")}</H2>

          <span className="text-paper-contrast/70">
            {t("sign-in.subtitle")}
          </span>
        </div>

        <SignInForm />

        <div className="flex flex-col space-y-1 text-left text-[#817C7C]">
          <span>
            <Trans
              i18nKey="sign-in.helpers.sign-up"
              components={[<Link href="/sign-up" />]}
            />
          </span>

          <Link href="/forgot-password">
            {t("sign-in.helpers.forgot-password")}
          </Link>
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
  const {mutate} = useSignIn();

  const {t} = useTranslation();

  const {register, handleSubmit} = useForm<SignInForm>({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onFormSubmit = handleSubmit((form) => {
    mutate({
      email: form.email,
      password: form.password,
    });
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

        <Button type="submit">{t("sign-in.buttons.sign-in")}</Button>
      </div>
    </form>
  );
};
