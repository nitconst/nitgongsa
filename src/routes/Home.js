import React, { useEffect, useState } from "react";
import { dbService } from "fbase";
import { collection, addDoc,  query, onSnapshot, orderBy } from "firebase/firestore";
import Register from "components/Register";
import ReadGongsa from "components/ReadGongsa";

const Home = ({userObj}) => {
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
      <Register userObj={userObj}/>
      <ReadGongsa />
    </div>
  );
};

export default Home;
