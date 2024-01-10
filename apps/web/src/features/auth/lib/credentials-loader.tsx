import {useEffect} from "react";
import {useSelector} from "react-redux";

import {useDispatch} from "@shared/lib/store";

import {model} from "../model";

export const CredentialsLoader: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const dispatch = useDispatch();

  const credentials = useSelector(model.selectors.credentials);

  useEffect(() => {
    if (!credentials.data) dispatch(model.actions.fetchCredentials());
  }, []);

  if (credentials.isFetching) return null;

  return <>{children}</>;
};
