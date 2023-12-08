import {useState} from "react";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import {useForm} from "react-hook-form";

import {AuthenticationTemplate} from "@features/auth";
import {Button, H2, Link, TextField} from "@shared/ui";

interface ResetPasswordForm {
  password1: string;
  password2: string;
}

export const ResetPasswordPage: React.FC = () => {
  const {register} = useForm<ResetPasswordForm>();

  const [showPassword, setShowPassword] = useState({
    password1: false,
    password2: false,
  });

  return (
    <AuthenticationTemplate>
      <div className="flex flex-col space-y-8">
        <H2>New password</H2>

        <form className="w-[25rem] flex flex-col space-y-4">
          <div>
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

          <Button type="submit">Change email</Button>
        </form>

        <div className="flex space-x-1">
          <span>Don't have an account?</span>{" "}
          <Link href="/sign-up">Sign up!</Link>
        </div>
      </div>
    </AuthenticationTemplate>
  );
};
