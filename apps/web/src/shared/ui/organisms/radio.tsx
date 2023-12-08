import * as RadioGroup from "@radix-ui/react-radio-group";
import {cx} from "class-variance-authority";

interface RadioGroupRoot
  extends React.ComponentProps<typeof RadioGroup.Root>,
    React.PropsWithChildren {}

const Root: React.FC<RadioGroupRoot> = ({children, className, ...props}) => (
  <RadioGroup.Root {...props} className={cx("flex flex-col", className)}>
    {children}
  </RadioGroup.Root>
);

interface RadioGroupItem
  extends React.ComponentProps<typeof RadioGroup.Item>,
    React.PropsWithChildren {}

const Item: React.FC<RadioGroupItem> = ({children, className, ...props}) => (
  <div className={cx("flex items-center space-x-3", className)}>
    <RadioGroup.Item
      {...props}
      id={props.value}
      className="w-[1.5em] h-[1.5em] bg-paper rounded-full border-2 border-accent"
    >
      <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:block after:w-3 after:h-3 after:rounded-full after:bg-accent" />
    </RadioGroup.Item>

    <label htmlFor={props.value} className="1em cursor-pointer">
      {children}
    </label>
  </div>
);

export const Radio = {Root, Item};
