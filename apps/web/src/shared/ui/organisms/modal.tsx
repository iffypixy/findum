import React, {PropsWithChildren, ReactNode, useEffect, useState} from "react";
import * as Dialog from "@radix-ui/react-dialog";

interface ModalRootProps extends PropsWithChildren {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Root: React.FC<ModalRootProps> = ({children, ...props}) => (
  <Dialog.Root modal {...props}>
    {children}
  </Dialog.Root>
);

interface ModalRootFnProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ({close}: {close: () => void}) => ReactNode;
}

const RootFn: React.FC<ModalRootFnProps> = ({
  children,
  defaultOpen = false,
  open: isOpen = false,
  onOpenChange,
}) => {
  const [open, setOpen] = useState(isOpen || defaultOpen);

  useEffect(() => {
    setOpen(isOpen || defaultOpen);
  }, [isOpen, defaultOpen]);

  const close = () => setOpen(false);

  return (
    <Dialog.Root
      modal
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (onOpenChange) onOpenChange(open);
      }}
    >
      {children({close})}
    </Dialog.Root>
  );
};

const Trigger: React.FC<PropsWithChildren> = ({children}) => (
  <Dialog.Trigger asChild>{children}</Dialog.Trigger>
);

export interface ModalWindowPropsWithClose {
  close: () => void;
}

interface ModalWindowProps
  extends PropsWithChildren,
    Partial<ModalWindowPropsWithClose> {
  title?: string;
  description?: string;
}

const Window: React.FC<ModalWindowProps> = ({title, description, children}) => (
  <Dialog.Portal>
    <Dialog.Overlay className="bg-paper-contrast/60 fixed inset-0 z-40" />

    <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[450px] max-h-[85vh] bg-paper rounded-2xl shadow-even-md z-50 p-8 space-y-6">
      {title && (
        <Dialog.Title className="text-paper-contrast font-manrope font-medium text-2xl m-0">
          {title}
        </Dialog.Title>
      )}

      {description && (
        <Dialog.Description className="text-paper mt-[10px] mb-5 text-lg leading-normal">
          {description}
        </Dialog.Description>
      )}

      <div>{children}</div>
    </Dialog.Content>
  </Dialog.Portal>
);

const Close: React.FC<PropsWithChildren> = ({children}) => (
  <Dialog.Close asChild>{children}</Dialog.Close>
);

export const Modal = {Window, Trigger, Root, Close, RootFn};
