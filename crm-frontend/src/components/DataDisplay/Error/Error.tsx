import pageNotFound from "../../../assets/images/004-error-404.png"
import somethingWentWrong from "../../../assets/images/001-error.png"
import empty from "../../../assets/images/003-cloud-computing.png"
import data from "../../../assets/images/005-loading.png"
import { Link } from "react-router-dom"

interface IErrorProps {
  title?: string
  message?: string
  type?: string
  styles?: Object
}

const Error = ({ title, message, type, styles }: IErrorProps): JSX.Element => {
  return (
    <div className="w-full flex items-center dark:bg-black-700 my-10" style={styles}>
      <div className="max-w-7xl px-4 w-full mx-auto">
        <div className="flex flex-col-reverse md:grid grid-cols-2 md:gap-5 lg:gap-10">
          {(title || message) && (
            <div className="flex justify-center flex-col max-w-md px-4 mx-auto md:max-w-full md:px-0 md:mx-0 md:w-full">
              <h1 className="text-6xl sm:text-7xl md:text-8xl 2xl:text-9xl font-bold mb-5 md:mb-10 dark:text-white text-gray-900 -m-1">{title || "Oops!"}</h1>
              <p className="text-xl sm:text-2xl 2xl:text-3xl dark:text-white text-gray-800">{message}</p>

              {type === "404" && (
                <div className="mt-5">
                  <Link to="/" className="btn btn-contained btn-indigo uppercase">
                    Go Back
                  </Link>
                </div>
              )}
            </div>
          )}

          <div className={`max-w-md md:px-4 mx-auto mb-5 ${(title || message) ? "md:mb-0 md:max-w-full md:mx-0 md:w-full" : "col-span-2"}`}>
            {type === "404" && <img className="h-full ml-auto w-full max-w-xs" src={pageNotFound} alt="404" />}
            {type === "error" && <img className="h-full ml-auto w-full max-w-xs" src={somethingWentWrong} alt="Something went wrong." />}
            {type === "no-data" && <img className="h-full ml-auto w-full max-w-xs" src={empty} alt="No Results." />}
            {type === "loading" && <img className="h-full ml-auto wfull max-w-xs" src={data} alt="Loading..." />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Error
