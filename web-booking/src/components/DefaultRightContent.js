import PropTypes from "prop-types"
import { config } from "../utils/config"
export default function DefaultRightContent(props) {
  return (
    <div
      className="hidden h-2/5 sm:h-1/2 md:h-full md:w-1/2 md:flex md:items-end md:mt-0"
      style={{
        backgroundImage: `url(${config.app.rightImageSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "top",
      }}
    />
  )
}

DefaultRightContent.propTypes = {
  showAppointmentDetails: PropTypes.bool,
}
