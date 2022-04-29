import React, { useState } from "react";
import { dbService, storageService } from "fbase";
import { v4 as uuidv4 } from "uuid";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

const OweetFactory = ({ userObj }) => {
  const [attachment, setAttachment] = useState("");
  const [oweet, setOweet] = useState("");
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentURL = "";
    // await addDoc(collection(dbService, "oweets"), {
    //   text: oweet,
    //   createdAt: serverTimestamp(),
    //   creatorId: userObj.uid,
    // });
    // setOweet("");
    if (attachment !== "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentURL = await getDownloadURL(response.ref);
    }

    const oweetObj = {
      text: oweet,
      createdAt: Date.now(), //등록 시간, 사진 메타데이터 접근
      creatorId: userObj.uid,
      attachmentURL,
    };
    await addDoc(collection(dbService, "oweets"), oweetObj);
    setOweet("");
    setAttachment("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setOweet(value);
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
    <form onSubmit={onSubmit}>
      <input
        value={oweet}
        onChange={onChange}
        type="text"
        placeholder="What's on yout mind?"
        maxLength={120}
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
  );
};

let a = 2;

export default OweetFactory;
