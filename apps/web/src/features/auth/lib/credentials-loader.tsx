import {useCredentials} from "../queries";

export const CredentialsLoader: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [, {isLoading}] = useCredentials();

  if (isLoading) return null;

  return <>{children}</>;
};
