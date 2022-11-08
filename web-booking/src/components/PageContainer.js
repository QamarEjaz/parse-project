import React from "react";
import PropTypes from "prop-types";

import { motion } from "framer-motion";
import { pageVariants } from "../utils/transitions";

import DefaultRightContent from "./DefaultRightContent";
import Header from "./Header";

export default function PageContainer(props) {
  const { leftContent, rightContent, step } = props;

  return (
    <motion.div
      className="welcome"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
    >
      <div className="bg-main-bg font-open-sans">
        <Header step={step} />

        <main>
          <section className="flex flex-col h-screen max-w-screen-2xl overflow-hidden pt-24 sm:pt-40 mx-auto md:pt-24">
            <div className="flex-1 flex flex-col-reverse md:flex-row h-full">
              <div className="flex flex-col flex-1 w-full h-1/2 md:h-full px-4 pt-3 pb-5 overflow-auto xs:py-20 md:w-1/2 md:px-10 lg:px-16 lg:pt-10 2xl:pr-20 2xl:pl-10 mb-16">
                {leftContent}
              </div>
              {rightContent ?? <DefaultRightContent />}
            </div>
          </section>
        </main>
      </div>
    </motion.div>
  );
}

PageContainer.propTypes = {
  leftContent: PropTypes.element,
  rightContent: PropTypes.element,
  progress: PropTypes.number,
};
