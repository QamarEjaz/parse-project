/*
 *==========================================================================================
 * Smooth scrollbar.
 *==========================================================================================
 */

gsap.registerPlugin(ScrollTrigger);
const scroller = document.querySelectorAll("[data-scrollbar]");
var Scrollbar = window.Scrollbar;

[...scroller].map((scroller) => {
  const bodyScrollBar = Scrollbar.init(scroller, {
    damping: 0.03,
    renderByPixels: true,
    continuousScrolling: !1,
  });

  ScrollTrigger.scrollerProxy("#scrollbar", {
    scrollTop(value) {
      if (arguments.length) {
        bodyScrollBar.scrollTop = value;
      }
      return bodyScrollBar.scrollTop;
    },
  });

  bodyScrollBar.addListener(ScrollTrigger.update);
  bodyScrollBar.addListener(function (status) {
    var offset = status.offset;

    var details = document.getElementById("details");
    if (details) {
      details.style.top = offset.y + "px";
      details.style.left = offset.x + "px";
    }
  });

  ScrollTrigger.defaults({
    scroller: scroller,
  });
});

/*
 *==========================================================================================
 * Helpers.
 *==========================================================================================
 */

function handleMenu(animationIn = "fadeInLeft", animationOut = "fadeOutLeft") {
  var modal = document.getElementById("menu");
  var menuAnimationSelector = document.querySelectorAll(
    "[menu-animation-selector]"
  );
  var modalState = false;

  [...menuAnimationSelector].map((element) => {
    if (
      !element.classList.contains(animationIn) &&
      !element.classList.contains(animationOut)
    ) {
      element.classList.toggle(animationIn);
      modal.classList.toggle("hidden");
      modalState = false;
    } else if (
      element.classList.contains(animationIn) ||
      element.classList.contains(animationOut)
    ) {
      element.classList.toggle(animationIn);
      element.classList.toggle(animationOut);
      modalState = true;
    }
  });

  if (!modalState) {
    modal.classList.toggle("hidden");
  } else {
    setTimeout(() => {
      modal.classList.toggle("hidden");
    }, 1500);
  }
}
