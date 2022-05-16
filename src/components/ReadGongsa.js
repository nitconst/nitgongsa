import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  onSnapshot,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  documentId,
} from "firebase/firestore";
import { dbService, storageService } from "fbase";
import styled from "styled-components";
import { async } from "@firebase/util";
import { ref, deleteObject } from "firebase/storage";

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
  height: 200px;
  border: none;
`;

//firestore data 호출
const ReadGongsa = ({ userObj }) => {
  const [gongsaList, setGongsaList] = useState([]);

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

  //수정, 삭제 작업

  const handleEdit = async (key) => {
    console.log("안녕 나는 수정버튼");
    // 수정기능
    // 1. 전체 배열중에서 선택한 객체를 찾는다.
    // 2. 객체의 키값을 얻어낸다.
    // 3. 수정되는 부분.
    // 3. 1 Storage에 존재하는 사진을 변경하는 경우
    // 3.1.1 아마 docs 자체에 함수 존재할 것 같은데.
    // 3.1.2 사진을 새로 올리니까 새로운 시간을 반영해야됨.
    // 3.2 Text를 변경하는 경우
    // 3.2.1 해당 객체의 텍스트를 변경해서 put하기.
    // 3.2.2 docs에 내용 존재
    // 4. 그 이후에 새로고침을 시킨다.
    await updateDoc(doc(dbService, "gongsa", key), {
      text: "trueee",
    });
    // window.location.reload();
  };
  const handleCancle = async (key, index) => {
    console.log("안녕 나는 삭제버튼");
    console.log(gongsaList[index].attachmentUrl);
    // 삭제기능
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (ok) {
      await deleteDoc(doc(dbService, "gongsa", key));
      // await storageService.refFromURL(gongsaList[index].attachmentUrl).delete();
      window.location.reload();
    }
  };

  //firestore data 표시
  return (
    <div>
      <h2>현성씨 Component</h2>
      {gongsaList.map((el, index) => (
        <div key={index}>
          <ul>
            <li>{el.addr}</li>
            <li>{el.createdAt}</li>
          </ul>
          <li>
            <Img src={el.attachmentUrl} />
          </li>
          {userObj.uid === el.createdId ? (
            <>
              <button
                onClick={() => {
                  handleEdit(el.docKey);
                }}
              >
                수정
              </button>
              <button
                onClick={() => {
                  handleCancle(el.docKey, index);
                }}
              >
                삭제
              </button>
            </>
          ) : (
            ""
          )}
        </div>
      ))}
    </div>
  );
};

export default ReadGongsa;
