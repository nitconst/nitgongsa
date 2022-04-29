import { useEffect, useState } from "react";
import AppRouter from "./components/Router";
import { authService } from "./fbase";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    authService.onAuthStateChanged((user) => { //유저상태변화 정보
      if (user) {
        setIsLoggedIn(true);
        setUserObj({ 
          displayName: user.phoneNumber, //로그인 시 폰 넘버
          uid: user.uid,  //파이어베이스 제공 식별자
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
  console.log(userObj);
  return (
    <>
      {init ? (
        <AppRouter
          isLoggedIn={isLoggedIn}
          refreshUser={refreshUser}
          userObj={userObj} //관리
        />
      ) : (
        "Initializing..."
      )}
    </>
  );
}

export default App;
