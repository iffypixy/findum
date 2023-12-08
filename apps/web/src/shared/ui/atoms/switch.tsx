import * as S from "@radix-ui/react-switch";

export const Switch: React.FC<S.SwitchProps> = (props) => (
  <S.Root className="w-12 h-6 rounded-full bg-paper-contrast/10" {...props}>
    <S.Thumb className="block w-5 h-5 bg-paper rounded-full transition data-[state=checked]:bg-accent translate-x-0.5 data-[state=checked]:translate-x-6" />
  </S.Root>
);
