import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";
import Lottie from "react-lottie";
import loadingAnimationData from "lotties/loading-construction.json";
import { ajaxTransport } from "jquery";

const App = () => {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const userNum = [
    { code: "001", type: "임직원" },
    { code: "002", type: "협력사" },
    { code: "003", type: "오거크레인/포크레인 기사" },
  ];

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      //유저상태변화 정보
      if (user) {
        setIsLoggedIn(true);
        setUserObj({
          displayName: user.phoneNumber, //로그인 시 폰 넘버
          uid: user.uid, //파이어베이스 제공 식별자
          code: ajaxTransport.code,
        });
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.phoneNumber,
      uid: user.uid,
    });
  };

  // RouteChangeTracker();
  //
  return (
    <>
      {init ? (
        <>
          <AppRouter
            isLoggedIn={isLoggedIn}
            refreshUser={refreshUser}
            userObj={userObj} //관리
            //codeNum={codeNum}
          />
        </>
      ) : (
        <div className="auth-container">
          <Lottie options={defaultOptions} height={200} width={200} />
        </div>
      )}
    </>
  );
};

export default App;
