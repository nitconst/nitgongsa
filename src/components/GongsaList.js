import React, { useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { dbService, storageService } from "fbase";
import styled from "styled-components";
import {
  ref,
  deleteObject,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const Img = styled.img`
  height: 100px;
  border: none;
`;

const GongsaList = ({ gongsaObj, isOwner, userObj }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [textEdit, setTextEdit] = useState(gongsaObj.text);
  const [attachment, setAttachment] = useState("");

  //삭제 기능
  const handleCancle = async (key, index) => {
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (ok) {
      await deleteDoc(doc(dbService, "gongsa", key));
      await deleteObject(ref(storageService, gongsaObj.attachmentUrl));
      window.location.reload();
    }
  };

  //수정 기능
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTextEdit(value);
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

  //업데이트 기능
  const handleSubmit = async (key) => {
    let attachmentUrl = "";
    if (attachment !== "") {
      await deleteObject(ref(storageService, gongsaObj.attachmentUrl));
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentUrl = await getDownloadURL(response.ref);
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
  const toggleEditing = () => setIsEditing((prev) => !prev);

  return (
    <div>
      {isEditing ? (
        <>
          <div>
            <Img src={gongsaObj.attachmentUrl} />
            <input type="text" value={textEdit} onChange={onChange} required />
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button
              onClick={() => {
                handleSubmit(gongsaObj.docKey);
              }}
            >
              업데이트
            </button>
            <button onClick={toggleEditing}>취소</button>
          </div>
        </>
      ) : (
        <>
          <h4>{gongsaObj.text}</h4>
          <Img src={gongsaObj.attachmentUrl} />
          {isOwner && (
            <>
              <button onClick={toggleEditing}>수정</button>
              <button
                onClick={() => {
                  handleCancle(gongsaObj.docKey);
                }}
              >
                삭제
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default GongsaList;
