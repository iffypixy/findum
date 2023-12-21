import {useEffect} from "react";

export const RobokassaLoader: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  useEffect(() => {
    const script = document.createElement("script");

    script.src =
      "https://auth.robokassa.ru/Merchant/bundle/robokassa_iframe.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <>{children}</>;
};
