import {AuthenticationTemplate} from "@features/auth";
import {Button, H2, Link, TextField} from "@shared/ui";

export const ForgotPasswordPage: React.FC = () => {
  return (
    <AuthenticationTemplate>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <H2>Forgot password?</H2>

          <span className="text-paper-contrast/70">
            No worries, we’ll send you reset instruction
          </span>
        </div>

        <form className="w-[25rem] flex flex-col space-y-2">
          <TextField
            type="email"
            label="Email address"
            placeholder="metaorta@gmail.com"
          />

          <Button type="submit">Reset password</Button>
        </form>

        <div className="flex space-x-1">
          <span>Don't have an account?</span>{" "}
          <Link href="/sign-up">Sign up!</Link>
        </div>
      </div>
    </AuthenticationTemplate>
  );
};
