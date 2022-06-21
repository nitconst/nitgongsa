import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";
import Lottie from "react-lottie";
import loadingAnimationData from "lotties/loading-construction.json";

const App = () => {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //조직관할 코드 Array(서울 : 1 경기 : 2 인천 : 3 강원 : 4)
  const codeNum = [
    { code: "000", region: "전체" },
    { code: "100", region: "---서울---" },
    { code: "101", region: "강남구" },
    { code: "102", region: "강동구" },
    { code: "103", region: "강서구" },
    { code: "104", region: "관악구" },
    { code: "105", region: "구로구" },
    { code: "106", region: "금천구" },
    { code: "107", region: "동작구" },
    { code: "108", region: "서초구" },
    { code: "109", region: "송파구" },
    { code: "110", region: "양천구" },
    { code: "111", region: "영등포구" },
    { code: "200", region: "---경기---" },
    { code: "201", region: "과천시" },
    { code: "202", region: "광명시" },
    { code: "203", region: "광주시" },
    { code: "204", region: "군포시" },
    { code: "205", region: "김포시" },
    { code: "206", region: "부천시" },
    { code: "207", region: "성남시" },
    { code: "208", region: "수원시" },
    { code: "209", region: "시흥시" },
    { code: "210", region: "안산시" },
    { code: "211", region: "안성시" },
    { code: "212", region: "안양시" },
    { code: "213", region: "여주시" },
    { code: "215", region: "오산시" },
    { code: "216", region: "용인시" },
    { code: "217", region: "의왕시" },
    { code: "218", region: "이천시" },
    { code: "219", region: "평택시" },
    { code: "220", region: "하남시" },
    { code: "221", region: "화성시" },
    { code: "300", region: "---인천---" },
    { code: "301", region: "계양구" },
    { code: "302", region: "남구" },
    { code: "303", region: "남동구" },
    { code: "304", region: "동구" },
    { code: "305", region: "부평구" },
    { code: "306", region: "연수구" },
    { code: "307", region: "옹진군" },
    { code: "308", region: "중구" },
    { code: "400", region: "---강원---" },
    { code: "401", region: "강릉시" },
    { code: "999", region: "---기타---" },
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
        });
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  //ㅎㅇ

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.phoneNumber,
      uid: user.uid,
    });
  };

  // RouteChangeTracker();

  return (
    <>
      {init ? (
        <>
          <AppRouter
            isLoggedIn={isLoggedIn}
            refreshUser={refreshUser}
            userObj={userObj} //관리
            codeNum={codeNum}
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
