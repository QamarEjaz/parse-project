import React from "react";

import { config } from "../utils/config";
import { formatDate } from "../utils/helpers";

const SlotButton = ({ onClick, value, isSelected = false }) => {
  return (
    <div
      className={`w-24 px-3 py-2 mb-3 mr-1 border-0 text-sm rounded-full shadow-sm ${
        isSelected
          ? config.app.backgroundColor + " text-blue"
          : "bg-gray-100 text-black"
      } transition ease-in duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isSelected ? `${config.app.focusRingColor} text-white` : "focus:ring-gray-100 "
      } focus:shadow-lg hover:shadow-lg md:text-base text-center cursor-pointer`}
      onClick={onClick}
    >
      <span className="whitespace-nowrap">
        {formatDate(value.start, 'h:mm a', 'HH:mm')}
      </span>
    </div>
  );
};

export default SlotButton;
