import React, {useEffect, useRef, useState} from "react";
import { dbService, storageService } from "../fbase";
import { collection, addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import EXIF from "exif-js";
// import {auth} from "firebase/auth";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

const Register = ({userObj}) => {
  const [gongsa, setGongsa] = useState("");
  const [gongsas, setGongsas] = useState([]);
  const [attachment, setAttachment] = useState("")

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";

    if(attachment !== ""){
    const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
    const response = await uploadString(
      attachmentRef,
      attachment, 
      "data_url"
      );
    attachmentUrl = await getDownloadURL(response.ref);
    }

    const gongsaObj = {
      text: gongsa,
      createdAt: Date.now(),
      createdId: userObj.uid,
      attachmentUrl,
      // phoneNumber,
    };
    await addDoc(collection(dbService, "gongsa"), gongsaObj);
    setGongsa("");
    setAttachment("");
};

  const onChange = (event) => {
    const {
      target : {value}
    } = event;
    setGongsa(value);
  };
  const onFileChange = (event) => {
    const {
      target: {files},
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: {result},
      } = finishedEvent;
      setAttachment(result)
    };
    reader.readAsDataURL(theFile);
};
  const onClearAttachment = () => {
    setAttachment(null)
    fileInput.current.value = null;
  }

  const fileInput = useRef();


  return(
    <div>
      <h2>민정씨 Component</h2>
      <form onSubmit={onSubmit}>
        <input
          value={gongsa}
          onChange={onChange}
          type="text"
          placeholder="공사 정보 입력"
        />
        <input type="file" accept="image/*" onChange={onFileChange} ref={fileInput}/>  
        <input type="submit" value="submit" />
        {attachment && (
        <div>
        <img src={attachment} width="50px" height="50px" />
        <button onClick={onClearAttachment}>Clear</button>
        </div>
        )}
      </form>
      </div>
  );
  };

export default Register;