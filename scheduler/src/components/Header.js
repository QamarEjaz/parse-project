import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../Store/Auth/actions";

// const TOTAL_PROGRESS = 100;
// const TOTAL_STEPS = 7;

export default function Header() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.AuthRed?.user);
  const navigate = useNavigate();
  // let progress = (TOTAL_PROGRESS / TOTAL_STEPS) * step;
  // if (progress > 100) progress = 100;
  // if (progress < 0) progress = 0;

  return (
    <header className="relative z-10">
      <div className="absolute w-full bg-white">
        <nav className="relative flex items-center p-4 border-b-2 border-mobile-grey-400 md:p-5">
          {/* {window.location.pathname === "/" ||
          window.location.pathname === "/patients" ||
          window.location.pathname === "/confirmation" ? null : (
            <button
              className="text-5xl absolute hidden md:block"
            >
              <img src="../assets/imgs/left-arrow (1).png" alt="Back button" />
            </button>
          )} */}

          <img
            className="mx-auto h-12 md:h-14"
            src="../../assets/imgs/image0.png"
            alt="logo"
          />
          {user?.objectId ? (
            <div className="absolute right-10">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="h-8 w-8 rounded-full border-2">
                    { user?.firstName ? user?.firstName[0] : 'U' }
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute z-10 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1 ">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? "bg-gray-400 text-white" : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            onClick={() => {
                              dispatch(logout());
                              navigate('/login')
                            }}
                          >
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          ) : null}
          {/* <div
            className={`absolute left-0 -bottom-1 h-2 ${config.app.backgroundColor}`}
            style={{ width: `${progress}%` }}
          ></div> */}
        </nav>
      </div>
    </header>
  );
}
