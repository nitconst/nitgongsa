import React, { useEffect, useState } from "react";
import { authService, dbService } from "fbase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onLog } from "@firebase/app";
import GongsaList from "components/GongsaList";

import axios from "axios";

const backUrl = process.env.REACT_APP_BACKEND_URL;

const Profile = ({ userObj }) => {
  console.log(userObj);
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [myGongsa, setMyGongsa] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const q = {
        phone: userObj.displayName,
        search: "my",
      };
      await axios
        .get(backUrl, { params: q })
        .then((res) => {
          const gongsaArr = res.data.map((doc) => ({
            id: doc.id,
            ...doc.data(), //합쳐서 보여줌
          }));
          setMyGongsa(gongsaArr);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchData();

    // async function querySnapShot() {
    //   const q = query(
    //     collection(dbService, "gongsa"),
    //     where("createdId", "==", userObj.uid)
    //   );

    //   const querySnapshot = await getDocs(q);
    //   const gongsaArr = querySnapshot.docs.map((doc) => ({
    //     id: doc.id,
    //     ...doc.data(), //합쳐서 보여줌
    //   }));
    //   setMyGongsa(gongsaArr);
    // }
    // querySnapShot();
    setNewDisplayName(userObj.displayName.replace("+82", "0"));
  }, []);
  const onLogOutClick = async () => await authService.signOut();

  return (
    <div className="container is-mobile">
      <button className="button is-ghost is-small" onClick={onLogOutClick}>
        로그아웃
      </button>
      <div className="content">
        <div className="boxForm box">
          <div className="box-header">
            <span className="icon">
              <i className="fas fa-lg fa-list-check"></i>
            </span>
            <p className="box-header-text">{newDisplayName}님의 공사리스트</p>
          </div>
          <hr className="hr-main" />
          {myGongsa.map((gongsa) => (
            <GongsaList
              gongsaObj={gongsa}
              key={gongsa.docKey}
              userObj={userObj}
              isOwner={gongsa.createdId === userObj.uid}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
