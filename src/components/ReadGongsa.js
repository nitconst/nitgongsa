import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { dbService } from "fbase";
import styled from "styled-components";
import GongsaList from "./GongsaList";

const ReadGongsa = ({ userObj, codeNum }) => {
  const [gongsaList, setGongsaList] = useState([]);
  const [selectedItem, setSelectedItem] = useState("000");

  //firestore data 호출
  useEffect(() => {
    getGongsaData();
  }, []);

  useEffect(() => {
    if (selectedItem === "000") getGongsaData();
    else getGongsaDataByRegion();
  }, [selectedItem]);

  const getGongsaData = async () => {
    const querySnapshot = await getDocs(collection(dbService, "gongsa"));
    const querySnapshotArray = [];
    querySnapshot.forEach((doc) => {
      querySnapshotArray.push(doc.data());
    });
    setGongsaList(querySnapshotArray);
  };

  const onChangeHandler = (e) => {
    setSelectedItem(e.currentTarget.value);
  };

  const getGongsaDataByRegion = async () => {
    const q = query(
      collection(dbService, "gongsa"),
      where("regioncode", "==", selectedItem)
    );

    const querySnapshot = await getDocs(q);
    const querySnapshotArray = [];
    querySnapshot.forEach((doc) => {
      querySnapshotArray.push(doc.data());
    });
    setGongsaList(querySnapshotArray);
  };

  //firestore data 표시
  return (
    <div className="content">
      <div className="boxForm box">
        <div className="box-header">
          <span className="icon">
            <i className="fa-solid fa-list-check is-large"></i>
          </span>
          <p className="box-header-text">공사신고 리스트</p>
        </div>

        <div className="select select-region">
          <select value={selectedItem} onChange={(e) => onChangeHandler(e)}>
            {codeNum.map((item, index) => (
              <option key={item.code} value={item.code}>
                {item.region}
              </option>
            ))}
          </select>
        </div>
        <hr className="hr-main" />
        {gongsaList.map((gongsa) => (
          <GongsaList
            gongsaObj={gongsa}
            key={gongsa.docKey}
            userObj={userObj}
            codeNum={codeNum}
            isOwner={gongsa.createdId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default ReadGongsa;
