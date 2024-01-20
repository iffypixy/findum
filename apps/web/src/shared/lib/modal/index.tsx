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

// open
//   ? createPortal(
//       <>
//         <div
//           onClick={onClose}
//           role="presentation"
//           className="fixed inset-0 -z-10 bg-[rgba(255, 255, 255, 0.4)]"
//         />

//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           {children}
//         </div>
//       </>,
//       document.body,
//     )
//   : null;
