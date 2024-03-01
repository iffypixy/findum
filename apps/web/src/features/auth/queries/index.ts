import {useMutation, useQuery} from "@tanstack/react-query";

import {api} from "@shared/api";
import {
  LoginDto,
  LogoutDto,
  RegisterDto,
  ResetPasswordDto,
} from "@shared/api/auth";
import {ChangePasswordDto, EditProfileDto} from "@shared/api/profile";

export const useCredentials = () => {
  const query = useQuery({
    queryKey: queryKeys.credentials,
    queryFn: async () => {
      const res = await api.auth.getCredentials();

      return res.data;
    },
    retry: false,
  });

  const credentials = query.data?.credentials;
  const isAuthenticated = !!credentials;

  return [{credentials, isAuthenticated}, query] as const;
};

export const useSignUp = () => {
  const {mutateAsync, ...mutation} = useMutation({
    mutationKey: ["auth", "sign-up"],
    mutationFn: async (req: RegisterDto["req"]) => {
      const res = await api.auth.register(req);

      return res.data;
    },
  });

  return {signUp: mutateAsync, ...mutation};
};

export const useSignIn = () =>
  useMutation({
    mutationKey: ["auth", "sign-in"],
    mutationFn: async (req: LoginDto["req"]) => {
      const res = await api.auth.login(req);

      return res.data;
    },
  });

export const useChangePassword = () => {
  const {mutateAsync: changePassword, ...mutation} = useMutation({
    mutationKey: ["auth", "change-password"],
    mutationFn: async (req: ChangePasswordDto["req"]) => {
      const res = await api.profile.changePassword(req);

      return res.data;
    },
  });

  return {changePassword, ...mutation};
};

export const useEditProfile = () => {
  const {mutateAsync: editProfile, ...mutation} = useMutation({
    mutationKey: ["auth", "edit-profile"],
    mutationFn: async (req: EditProfileDto["req"]) => {
      const res = await api.profile.editProfile(req);

      return res.data;
    },
  });

  return {editProfile, ...mutation};
};

export const useLogout = () => {
  const {mutateAsync: logout, ...mutation} = useMutation({
    mutationKey: ["auth", "logout"],
    mutationFn: async (req: LogoutDto["req"]) => {
      const res = await api.auth.logout(req);

      return res.data;
    },
  });

  return {logout, ...mutation};
};

export const useResetPassword = () => {
  const {mutateAsync: resetPassword, ...mutation} = useMutation({
    mutationKey: ["auth", "reset-password"],
    mutationFn: async (req: ResetPasswordDto["req"]) => {
      const res = await api.auth.resetPassword(req);

      return res.data;
    },
  });

  return {resetPassword, ...mutation};
};

export const queryKeys = {
  credentials: ["auth", "credentials"],
};
