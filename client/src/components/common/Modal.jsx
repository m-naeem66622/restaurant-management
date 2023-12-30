import React from "react";

const Modal = ({ isOpen, closeModal, children }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex justify-center overflow-auto py-4">
          <div className="bg-white p-6 rounded-md shadow-md w-full max-w-xl h-fit">
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
