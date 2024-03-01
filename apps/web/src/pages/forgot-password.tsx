import {useState} from "react";
import {useForm} from "react-hook-form";

import {AuthenticationTemplate} from "@features/auth";
import {api} from "@shared/api";
import {Button, H2, H3, Link, TextField} from "@shared/ui";

interface Form {
  email: string;
}

export const ForgotPasswordPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm<Form>({
    defaultValues: {
      email: "",
    },
  });

  const [sent, setSent] = useState(false);

  return (
    <AuthenticationTemplate>
      {sent ? (
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col space-y-2">
            <H3>Reset link sent to your email</H3>
            <span className="text-paper-contrast/60 text-lg">
              Check your mailbox
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <H2>Forgot password?</H2>

            <span className="text-paper-contrast/70">
              No worries, we’ll send you reset instruction
            </span>
          </div>

          <form
            onSubmit={handleSubmit((form) => {
              api.auth
                .sendRecovery({
                  email: form.email,
                })
                .then(() => {
                  setSent(true);
                });
            })}
            className="w-[25rem] flex flex-col space-y-2"
          >
            <TextField
              type="email"
              label="Email address"
              placeholder="metaorta@gmail.com"
              error={errors.email?.message}
              {...register("email", {
                required: true,
              })}
            />

            <Button disabled={!isValid} type="submit">
              Reset password
            </Button>
          </form>

          <div className="flex space-x-1">
            <span>Don't have an account?</span>{" "}
            <Link href="/sign-up">Sign up!</Link>
          </div>
        </div>
      )}
    </AuthenticationTemplate>
  );
};
