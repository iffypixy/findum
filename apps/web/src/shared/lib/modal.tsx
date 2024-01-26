import M from "react-modal";

export interface WrappedModalProps {
  open: boolean;
  onClose: () => void;
}

interface ModalProps extends WrappedModalProps {
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({children, open, onClose}) => (
  <M
    isOpen={open}
    onRequestClose={onClose}
    style={{
      content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        border: "none",
        background: "none",
      },
      overlay: {
        background: "rgba(0,0,0,0.6)",
      },
    }}
  >
    {children}
  </M>
);
