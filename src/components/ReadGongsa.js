import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { dbService, storageService } from "fbase";
import styled from "styled-components";
import { async, querystring } from "@firebase/util";
import {
  ref,
  deleteObject,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

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
  const [isEditing, setIsEditing] = useState(false);
  const [changingIndex, setChangingIndex] = useState();
  const [textEdit, setTextEdit] = useState();
  const [attachment, setAttachment] = useState("");

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

  //수정기능
  const handleEdit = (index) => {
    setIsEditing(true);
    setChangingIndex(index);
    setTextEdit(gongsaList[index].text);
  };
  const handleChange = (e) => {
    setTextEdit(e.target.value);
  };

  const handleFileChange = async (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const handleSubmit = async (key, index) => {
    let attachmentUrl = "";
    if (attachment !== "") {
      await deleteObject(ref(storageService, gongsaList[index].attachmentUrl));
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentUrl = await getDownloadURL(response.ref);
      console.log(attachmentUrl);
      await updateDoc(doc(dbService, "gongsa", key), {
        text: textEdit,
        attachmentUrl: attachmentUrl,
      });
    } else if (attachment === "") {
      await updateDoc(doc(dbService, "gongsa", key), {
        text: textEdit,
      });
    }
    window.location.reload();
  };

  //수정 취소기능
  const cancelEditing = () => setIsEditing((prev) => !prev);

  // 삭제기능
  const handleCancle = async (key, index) => {
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (ok) {
      await deleteDoc(doc(dbService, "gongsa", key));
      await deleteObject(ref(storageService, gongsaList[index].attachmentUrl));
      window.location.reload();
    }
  };

  //firestore data 표시
  return (
    <div>
      <h2>현성씨 Component</h2>
      {gongsaList.map((el, index) => (
        <div key={el.docKey}>
          {isEditing ? (
            <>
              {changingIndex === index ? (
                <>
                  <Img src={el.attachmentUrl} />
                  <div>
                    <input
                      type="text"
                      placeholder={el.text}
                      onChange={handleChange}
                      value={textEdit}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <button
                      onClick={() => {
                        handleSubmit(el.docKey, index);
                      }}
                    >
                      업데이트
                    </button>
                  </div>
                  <button onClick={cancelEditing}>취소</button>
                </>
              ) : (
                <>
                  <h4>{el.text}</h4>
                  <Img src={el.attachmentUrl} />
                  {userObj.uid === el.createdId ? (
                    <>
                      <button
                        onClick={() => {
                          handleEdit(index);
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
                </>
              )}
            </>
          ) : (
            <>
              <h4>{el.text}</h4>
              <Img src={el.attachmentUrl} />
              {userObj.uid === el.createdId ? (
                <>
                  <button
                    onClick={() => {
                      handleEdit(index);
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
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReadGongsa;
