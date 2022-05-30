import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { dbService, storageService } from "fbase";
import styled from "styled-components";
import GongsaList from "./GongsaList";

//style 적용
// const StyledUl = styled.ul`
//   display: inline-block;
//   list-style: none;
//   background-color: skyblue;
//   width: 800px;
//   border: 1px solid gray;
//   text-align: center;
//   border-radius: 25px;
//   margin-right: 20px;
// `;
// const StyledLi = styled.li`
//   display: inline-block;
//   height: 50px;
//   line-height: 50px;
//   font-weight: bold;
//   padding: 0px;
// `;
// const StyledTime = styled.li`
//   text-align: right;
// `;

const Img = styled.img`
  height: 100px;
  border: none;
`;

const ReadGongsa = ({ userObj }) => {
  const [gongsaList, setGongsaList] = useState([]);

  //firestore data 호출
  useEffect(() => {
    getGongsaData();
  }, []);

  const getGongsaData = async () => {
    const querySnapshot = await getDocs(collection(dbService, "gongsa"));
    const querySnapshotArray = [];
    querySnapshot.forEach((doc) => {
      querySnapshotArray.push(doc.data());
    });
    setGongsaList(querySnapshotArray);
  };

  //firestore data 표시
  return (
    <div>
      <h2>현성씨 Component</h2>
      {gongsaList.map((gongsa) => (
        <GongsaList
          gongsaObj={gongsa}
          key={gongsa.docKey}
          userObj={userObj}
          isOwner={gongsa.createdId === userObj.uid}
        />
      ))}
    </div>
  );
};

export default ReadGongsa;
