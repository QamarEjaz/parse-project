import { useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";

const Modal = ({ isOpen, closeModal, onSubmit, setHomeOfficeWarning, homeOfficeWarning }) => {

  useEffect(() => {
    if (!homeOfficeWarning) {
      onSubmit()
      closeModal(false)
    }
  }, [homeOfficeWarning])

  return (
    <Transition appear show={isOpen} as={"div"}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-y-auto z-50 backdrop-blur-sm"
        onClose={() => closeModal(false)}
      >
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:px-4 sm:p-0">
          <Transition.Child
            as={"div"}
            className="w-full max-w-lg"
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className="inline-block align-bottom bg-white dark:bg-black-700 rounded-lg text-left overflow-visible transform transition-all sm:my-8 sm:align-middle w-full sm:max-w-4xl sm:w-full"
              style={{ boxShadow: "rgb(0 0 0 / 10%) 1px 1px 8px 5px" }}
            >
              <section className="flex flex-col max-w-screen-2xl overflow-hidden sm:pt-40 mx-auto md:pt-0">
                <div className="w-full px-4 py-4 xs:py-20 md:px-10 lg:px-8 2xl:pr-20 2xl:pl-8 border-b border-gray-300">
                  <h1 className="font-medium text-xl text-gray-700 dark:text-black">
                    This office is not the patient's home office, continue anyway?
                  </h1>
                </div>
                <div className="p-4 border-t border-gray-300 text-right">
                <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 mr-2 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => { setHomeOfficeWarning(false); }}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => closeModal(false)}
                  >
                    No
                  </button>
                </div>
              </section>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
