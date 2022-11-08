import { useState, useEffect } from "react";
import AuthCode from "react-auth-code-input";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Button from "../../components/Button";
import PageContainer from "../../components/PageContainer";
import PageTitle from "../../components/PageTitle";
import StickyContainer from "../../components/StickyContainer";
import { Login } from "../../Store/Auth/actions";

const OTP_LENGTH = 4;

export default function Verify(props) {
  const dispatch = useDispatch();
  let history = useHistory();
  const user = useSelector((state) => state?.AuthRed?.user);
  const formType = useSelector((state) => state?.AuthRed?.formType);
  const [isLoading, setIsLoading] = useState(false);
  const [otpCode, setOtpCode] = useState();

  const doLogin = async () => {
    setIsLoading(true);
    dispatch(
      Login({
        password: otpCode,
        username: user?.username,
        history: history,
        formType: formType,
      })
    );
    setIsLoading(false);
  };

  useEffect(() => {
    if (otpCode?.length === 4) {
      doLogin();
    }
  }, [otpCode]);

  const emailAndPassFunc = () => {
    if (user.phone) {
      return true;
    }
  };

  return (
    <PageContainer
      step={2}
      leftContent={
        <>
          <button className="mb-4" onClick={() => props.setVerifications(0)}>
            <img src="../assets/imgs/left-arrow (1).png" alt="Back button" />
          </button>
          
          <PageTitle title="Verify phone number">
            Please enter the {OTP_LENGTH} digit code we&nbsp;
            {emailAndPassFunc() ? "texted" : "emailed"} to you.
          </PageTitle>
          <p className="text-sm md:text-lg mt-1 md:mt-3 text-mobile-grey-600">
            Please check this&nbsp;
            <b>
              {user.phone
                ? `phone number: ${user.phone}`
                : `email address: ${user.email}`}
            </b>
            &nbsp;for the OTP code.
          </p>
          <div className="flex justify-center mt-8 mb-16">
            <AuthCode
              length={OTP_LENGTH}
              onChange={(e) => setOtpCode(e)}
              inputClassName="w-16 lg:w-24 py-5 placeholder-mobile-grey-200 border-none focus:ring-0  md:text-4xl text-center bg-gray-100 rounded-lg"
              containerClassName="flex space-x-4 md:space-x-8"
            />
          </div>
          <StickyContainer>
            <Button
              loading={isLoading}
              onClick={doLogin}
              title="Confirm phone number"
            />
          </StickyContainer>
        </>
      }
    />
  );
}
