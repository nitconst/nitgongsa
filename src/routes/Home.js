import React, { useEffect, useState } from "react";
import { dbService } from "fbase";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import Register from "components/Register";
import ReadGongsa from "components/ReadGongsa";

const Home = ({ userObj, codeNum }) => {
  const [gongsa, setGongsa] = useState([]);

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
  }, []);

  return (
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
  );
};

export default Home;
