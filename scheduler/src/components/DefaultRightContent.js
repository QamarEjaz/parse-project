import PropTypes from "prop-types"
// import { config } from "../utils/config"
export default function DefaultRightContent(props) {
  return (
    <div
      className="hidden h-2/5 sm:h-1/2 md:h-full md:w-2/3 md:flex md:mt-0">
        {/* <img src="../../assets/imgs/girl.png" /> */}
        <img
          className=" inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
          alt=""
        />
      </div>
  )
}

DefaultRightContent.propTypes = {
  showAppointmentDetails: PropTypes.bool,
}
