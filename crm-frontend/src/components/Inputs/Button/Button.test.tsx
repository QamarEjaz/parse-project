import { shallow } from "enzyme"
import Button from "./Button"
import { IButtonProps } from "./Button.interfaces"

describe("<Button> Component", () => {
  it("expect to render Button component without props", () => {
    expect(shallow(<Button />)).toMatchSnapshot()
  })
  it("expect to render Button component with props", () => {
    const mockProps: IButtonProps = { children: "Click me!", variant: "contained", color: "gray-dark" }
    expect(shallow(<Button {...mockProps} />)).toMatchSnapshot()
  })
  it("expect to render Button with text of Hello World", () => {
    const mockProps: IButtonProps = { children: "Hello World!", variant: "contained", color: "gray-dark" }
    const wrapper = shallow(<Button {...mockProps} />)

    expect(wrapper.find("#button-text").text()).toContain("Hello World!")
  })
  it("expect Button click event to work", () => {
    let isClickWorking = false

    const mockProps: IButtonProps = { children: "Click Me!", variant: "contained", color: "gray-dark", onClick: () => (isClickWorking = true) }

    const wrapper = shallow(<Button {...mockProps} />)

    wrapper.find("#button").simulate("click")

    expect(isClickWorking).toEqual(true)
  })
  it("expect Button loading to work", () => {
    const mockProps: IButtonProps = { children: "Click Me!", variant: "contained", color: "gray-dark", loading: true }

    const wrapper = shallow(<Button {...mockProps} />)

    expect(wrapper.find("#button-loader").exists()).toEqual(true)
  })
})
