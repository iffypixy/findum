import {useState} from "react";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import {useForm} from "react-hook-form";
import {useParams} from "wouter";

import {AuthenticationTemplate, useResetPassword} from "@features/auth";
import {Button, H2, Link, TextField} from "@shared/ui";
import {queryClient} from "@shared/lib/query";

interface ResetPasswordForm {
  password1: string;
  password2: string;
}

export const ResetPasswordPage: React.FC = () => {
  const {register, handleSubmit, watch} = useForm<ResetPasswordForm>();

  const {resetPassword} = useResetPassword();

  const [showPassword, setShowPassword] = useState({
    password1: false,
    password2: false,
  });

  const p1 = watch("password1");
  const p2 = watch("password2");

  const {code} = useParams() as {code: string};

  return (
    <AuthenticationTemplate>
      <div className="flex flex-col space-y-8">
        <H2>New password</H2>

        <form
          onSubmit={handleSubmit((form) => {
            if (form.password1 !== form.password2) return;

            resetPassword({
              code,
              password: form.password1,
            }).then(({credentials}) => {
              queryClient.setQueryData(["auth", "credentials"], {credentials});
            });
          })}
          className="w-[25rem] flex flex-col space-y-4"
        >
          <div>
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

          <Button disabled={p1 !== p2 || !p1} type="submit">
            Change password
          </Button>
        </form>

        <div className="flex space-x-1">
          <span>Don't have an account?</span>{" "}
          <Link href="/sign-up">Sign up!</Link>
        </div>
      </div>
    </AuthenticationTemplate>
  );
};
