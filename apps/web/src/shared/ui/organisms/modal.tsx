import {PropsWithChildren} from "react";
import * as Dialog from "@radix-ui/react-dialog";

interface ModalRootProps extends PropsWithChildren {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Root: React.FC<ModalRootProps> = ({children, ...props}) => (
  <Dialog.Root modal {...props}>
    {children}
  </Dialog.Root>
);

const Trigger: React.FC<PropsWithChildren> = ({children}) => (
  <Dialog.Trigger asChild>{children}</Dialog.Trigger>
);

interface ModalWindowProps extends PropsWithChildren {
  title?: string;
  description?: string;
}

const Window: React.FC<ModalWindowProps> = ({title, description, children}) => (
  <Dialog.Portal>
    <Dialog.Overlay className="bg-black data-[state=open]:animate-overlayShow fixed inset-0" />

    <Dialog.Content className="bg-paper p-8 rounded-2xl shadow-even-md">
      {title && (
        <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
          {title}
        </Dialog.Title>
      )}

      {description && (
        <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
          {description}
        </Dialog.Description>
      )}

      {children}
    </Dialog.Content>
  </Dialog.Portal>
);

export const Modal = {Window, Trigger, Root};
