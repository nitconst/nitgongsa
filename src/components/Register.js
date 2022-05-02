import React, { useState } from "react";
import { dbService, storageService } from "fbase";
import { v4 as uuidv4 } from "uuid";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

const Register = ({ userObj }) => {
  const [attachment, setAttachment] = useState("");
  const [gongsa, setgongsa] = useState("");
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentURL = "";
    
    if (attachment !== "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentURL = await getDownloadURL(response.ref);
    }

    const gongsaObj = {
      text: gongsa,
      createdAt: Date.now(), //등록 시간, 사진 메타데이터 접근
      creatorId: userObj.uid,
      attachmentURL,
    };
    await addDoc(collection(dbService, "gongsa"), gongsaObj);
    setgongsa("");
    setAttachment("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setgongsa(value);
  };
  const onFileChange = (event) => {
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
      console.log(result);
    };

    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => setAttachment("");
  return (
    <>
      <h2>민정씨 Component</h2>
      <form onSubmit={onSubmit}>
        <input
          value={gongsa}
          onChange={onChange}
          type="text"
          placeholder="공사 정보 입력"
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="submit" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
    </>
  );
};

export default Register;