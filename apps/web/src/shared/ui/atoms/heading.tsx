import {cx} from "class-variance-authority";

type HProps = React.ComponentProps<"h1">;

export const H1: React.FC<HProps> = ({className, children, ...props}) => (
  <h1 {...props} className={cx("text-7xl font-black", className)}>
    {children}
  </h1>
);

export const H2: React.FC<HProps> = ({className, children, ...props}) => (
  <h2 {...props} className={cx("text-5xl font-bold", className)}>
    {children}
  </h2>
);

export const H3: React.FC<HProps> = ({className, children, ...props}) => (
  <h3 {...props} className={cx("text-4xl font-semibold", className)}>
    {children}
  </h3>
);

export const H4: React.FC<HProps> = ({className, children, ...props}) => (
  <h4 {...props} className={cx("text-3xl font-semibold", className)}>
    {children}
  </h4>
);

export const H5: React.FC<HProps> = ({className, children, ...props}) => (
  <h5 {...props} className={cx("text-2xl font-semibold", className)}>
    {children}
  </h5>
);

export const H6: React.FC<HProps> = ({className, children, ...props}) => (
  <h6 {...props} className={cx("text-xl font-semibold", className)}>
    {children}
  </h6>
);
