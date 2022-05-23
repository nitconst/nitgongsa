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

const Home = ({ userObj }) => {
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
<<<<<<< HEAD
      <Register userObj={userObj} />
      <ReadGongsa />
    </div>
  );
=======
    {/* <Register/> //내용 옮기기
    <ReadGongsa/> */} 
  <form onSubmit={onSubmit}>
    <input value={gongsa} onChange={onChange} type="text" placeholder="공사 내용 입력"/>
    <input type="submit" value="제출"/>
  </form>
</div>
);
>>>>>>> develop
};

export default Home;
