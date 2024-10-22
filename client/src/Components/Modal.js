import { useEffect } from "react";
const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      // Disable scroll
      document.body.style.overflow = "hidden";
    } else {
      // Enable scroll
      document.body.style.overflow = "auto";
    }

    // Cleanup: Ensure scroll is enabled when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  if (!isOpen) return null; // Don't render modal if it's not open

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center ">
      {/* Background overlay */}
      <div
        className="sticky md:fixed inset-0 bg-black bg-opacity-50 "
        onClick={onClose}
      ></div>

      {/* Modal content */}
      {children}
    </div>
  );
};

export default Modal;
