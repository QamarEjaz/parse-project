import styled, { css } from "styled-components"
import tw from "twin.macro"

export interface IRowAnimationProps {
  animate: boolean
}

export const RowAnimation = styled.div<IRowAnimationProps>`
  ${(props): any =>
    props.animate ?
    css`
      background-image: linear-gradient(90deg, #ddd 0px, #e8e8e8 40px, #ddd 80px);
      animation: table-row-shines 1.6s infinite linear;
      ${tw`my-1 py-3 rounded-md shadow-md`}

      @keyframes table-row-shines {
        0% {
          opacity: 0.4;
        }
        40% {
          opacity: 0.8;
        }
        100% {
          opacity: 0.4;
        }
      }
    ` : css`${tw`whitespace-nowrap text-sm flex justify-start items-center`}`}
`
