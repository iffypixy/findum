import {useEffect, useState} from "react";

const getValue = (param: string) =>
  new URLSearchParams(window.location.search).get(param);

export const useSearchParam = (param: string) => {
  const [value, setValue] = useState(() => getValue(param));

  useEffect(() => {
    const onChange = () => setValue(getValue(param));

    window.addEventListener("popstate", onChange);
    window.addEventListener("pushstate", onChange);
    window.addEventListener("replacestate", onChange);

    return () => {
      window.removeEventListener("popstate", onChange);
      window.removeEventListener("pushstate", onChange);
      window.removeEventListener("replacestate", onChange);
    };
  }, [param]);

  return value;
};
