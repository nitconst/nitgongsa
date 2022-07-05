import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
import { dbService } from "fbase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import Register from "components/Register";
import ReadGongsa from "components/ReadGongsa";
import UserType from "components/UserType";

const Home = ({ userObj, codeNum }) => {
  const [gongsa, setGongsa] = useState([]);
  const [isUser, setIsUser] = useState(true);

  useEffect(() => {
    const type = query(
      collection(dbService, "usertype"),
      where("phone", "==", userObj.displayName)
    );
    onSnapshot(type, (snapshot) => {
      const typearr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(typearr);

      if (typearr == "") {
        setIsUser(false);
        console.log("메롱");
      }
    });
  }, []);

  return (
    <>
      {isUser ? (
        <div>
          <div className="container is-mobile">
            <section className="hero is-small is-link">
              <div className="hero-body">
                <p className="title">여기 공사</p>
                <p className="subtitle">
                  스마트폰 카메라 촬영으로 공사 간편신고가 가능한 Web입니다.
                </p>
              </div>
            </section>
            <article class="message is-info is-small">
              <div class="message-body">
                일정 횟수 신고 시 소정의 상품을 등록된 번호로 드립니다.
              </div>
            </article>
            <Register userObj={userObj} codeNum={codeNum} />
            <ReadGongsa userObj={userObj} codeNum={codeNum} />
          </div>
        </div>
      ) : (
        <div>
          <div className="container is-mobile">
            <div className="content">
              <h1>
                <p>안녕하세요!</p>
              </h1>
              <h3>
                <p>원활한 신고 관리를 위해</p> 최초 1회 사용자 정보 설정이
                필요합니다.
              </h3>
            </div>
            <UserType userObj={userObj} codeNum={codeNum} />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
