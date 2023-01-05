import React, { useEffect, useState } from "react";
import { authService } from "fbase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import Lottie from "react-lottie";
import mainAnimationData from "lotties/auth-construction.json";
import loadingAnimationData from "lotties/loading-construction.json";

const Auth = () => {
  const [phoneNumber, setPhonenumber] = useState("");
  const [codeNumber, setCodeNumber] = useState("");
  const [isSendSMS, setIsSendSms] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const appVerifier = window.recaptchaVerifier;
  const phoneNumberTest = "+16505551234";
  const testVerificationCode = "123456";

  // const REDIRECT_URI = "http://127.0.0.1:3000/auth";
  // 인증코드 발급 부분으로 redirecting 하면될듯
  // const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_API}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: mainAnimationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const defaultOptions2 = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const onChanged = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "phone") {
      setPhonenumber(value);
    } else if (name === "code") {
      setCodeNumber(value);
    }
  };
  useEffect(() => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
      },
      authService
    );
  }, []);
  const onSubmit = (event) => {
    event.preventDefault();
    authService.languageCode = "ko";
    // window.recaptchaVerifier = new RecaptchaVerifier(
    //   "recaptcha-container",
    //   {},
    //   authService
    // );
    setIsLoading(true);
    signInWithPhoneNumber(authService, "+82" + phoneNumber, appVerifier)
      .then((confirmationResult) => {
        setIsSendSms(true);
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        setIsLoading(false);
        // ...
      })
      .catch((error) => {
        console.log(error);
        // Error; SMS not sent
        // ...
      });
    // signInWithPhoneNumber(authService, phoneNumberTest, appVerifier)
    //   .then(function (confirmationResult) {
    //     // confirmationResult can resolve with the fictional testVerificationCode above.
    //     return confirmationResult.confirm(testVerificationCode);
    //   })
    //   .catch(function (error) {
    //     // Error; SMS not sent
    //     // ...
    //   });
  };

  const onCodeConfirmClick = (event) => {
    window.confirmationResult
      .confirm(codeNumber)
      .then((result) => {
        // User signed in successfully.
        const user = result.user;
        //console.log(user);
        // ...
      })
      .catch((error) => {
        //console.log(error);
        // User couldn't sign in (bad verification code?)
        // ...
      });
  };

  return (
    <>
      <div className="auth-container">
        <div className="content">
          <span class="tag is-warning">사외공사장 간편신고 웹</span>
        </div>

        <div className="content">
          <h1>여기 공사</h1>
        </div>
        <Lottie options={defaultOptions} height={200} width={200} />
        <div style={{ height: "38px" }}></div>
        <div
          className="field is-grouped"
          style={{ width: "183px", height: "45px" }}
        >
          <p className="control is-expanded">
            <input
              className="input"
              name="phone"
              type="phone"
              placeholder="'-'없이 전화번호 입력'"
              value={phoneNumber}
              onChange={onChanged}
              style={{ width: "183px", height: "45px" }}
            />
          </p>
        </div>
        <div
          className="field is-grouped"
          style={{ width: "183px", height: "45px" }}
        >
          <p className="control">
            <a
              className="button is-link"
              style={{ width: "183px", height: "45px", fontSize: "15px" }}
              onClick={onSubmit}
            >
              로그인
            </a>
          </p>
          <div>
            {isLoading && (
              <Lottie options={defaultOptions2} height={60} width={60} />
            )}
          </div>
        </div>

        <>
          {isSendSMS && (
            <div className="field is-grouped">
              <p className="control is-expanded">
                <input
                  className="input"
                  name="code"
                  type="text"
                  placeholder="인증번호"
                  required
                  value={codeNumber}
                  onChange={onChanged}
                />
              </p>
              <p className="control">
                <a
                  className="button is-dark is-rounded"
                  onClick={onCodeConfirmClick}
                >
                  인증번호확인
                </a>
              </p>
            </div>
          )}
        </>

        {/* <a href={KAKAO_AUTH_URL}>
          <img
            src={kakaoLogin}
            style={{ width: "183px", height: "45px" }}
          ></img>
        </a> */}

        <div id="recaptcha-container"></div>
      </div>
    </>
  );
};

export default Auth;
