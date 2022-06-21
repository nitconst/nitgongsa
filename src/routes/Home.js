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
    const q = query(
      collection(dbService, "gongsa"), //gongsa(collection name)
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const gongsaArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGongsa(gongsaArr);
    });

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
        console.log("메롱");
      }
    });

    // user 콜렉션 where절로 가져와서 setIsUser
    // ......
    //
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
            <Register userObj={userObj} codeNum={codeNum} />
            <ReadGongsa userObj={userObj} codeNum={codeNum} />
          </div>
        </div>
      ) : (
        <div>
          <div className="container">
            <div className="content">
              <span class="tag is-warning">사외공사장 간편신고 웹</span>
            </div>

            <div className="content">
              <h1>여기 공사</h1>
            </div>
            <UserType userObj={userObj} codeNum={codeNum} />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
