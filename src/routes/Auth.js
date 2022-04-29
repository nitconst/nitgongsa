import React, { useEffect, useState } from "react";
import { authService } from "../fbase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const Auth = () => {
  const [phoneNumber, setPhonenumber] = useState("");
  const [codeNumber, setCodeNumber] = useState("");
  const [isSendSMS, setIsSendSms] = useState("");
  const appVerifier = window.recaptchaVerifier;
  const phoneNumberTest = "+16505551234";
  const testVerificationCode = "123456";
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
    // signInWithPhoneNumber(authService, "+82" + phoneNumber, appVerifier)
    //   .then((confirmationResult) => {
    //     setIsSendSms(true);
    //     // SMS sent. Prompt user to type the code from the message, then sign the
    //     // user in with confirmationResult.confirm(code).
    //     window.confirmationResult = confirmationResult;
    //     // ...
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     // Error; SMS not sent
    //     // ...
    //   });
    signInWithPhoneNumber(authService, phoneNumberTest, appVerifier)
      .then(function (confirmationResult) {
        // confirmationResult can resolve with the fictional testVerificationCode above.
        return confirmationResult.confirm(testVerificationCode);
      })
      .catch(function (error) {
        // Error; SMS not sent
        // ...
      });
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
      <form onSubmit={onSubmit}>
        <input
          name="phone"
          type="phone"
          placeholder="'-' 없이 입력"
          required
          value={phoneNumber}
          onChange={onChanged}
        />
        <input type="submit" value="Log In" />
      </form>
      {isSendSMS && (
        <>
          <input
            name="code"
            type="text"
            placeholder="인증번호"
            required
            value={codeNumber}
            onChange={onChanged}
          />
          <button onClick={onCodeConfirmClick} value="인증번호확인" />
        </>
      )}
      <div id="recaptcha-container"></div>
    </>
  );
};

export default Auth;
