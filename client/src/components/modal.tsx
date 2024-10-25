import {ReactNode, useState} from "react";
import {FaTimes} from "react-icons/fa";

interface ModalProps {
  title?: string;
  buttonStyle?: string;
  trigger?: ReactNode;
  children: ReactNode;
}

const Modal = ({title, buttonStyle, trigger, children}: ModalProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {title && (
        <button
          className={`w-fit px-4 py-2 rounded-md transition-colors my-5 ${buttonStyle}`}
          onClick={() => setShowModal(true)}
        >
          {title}
        </button>
      )}
      {trigger && <div onClick={() => setShowModal(true)}>{trigger}</div>}
      {showModal ? (
        <div
          className="fixed top-1/2 left-1/2 bg-white rounded-md shadow-md shadow-black z-50 p-5 w-[80%] h-[80%] overflow-y-scroll no-scrollbar"
          style={{transform: "translate(-50%, -50%)"}}
        >
          {children}
          <button
            className="absolute top-5 right-5 p-1 bg-white hover:bg-red-600 text-black hover:text-white transition-all rounded-full cursor-pointer"
            onClick={() => setShowModal(false)}
          >
            <FaTimes size={24} />
          </button>
        </div>
      ) : null}
    </>
  );
};

export default Modal;
