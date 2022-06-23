import React, { useEffect, useState } from "react";
import { dbService, storageService } from "../fbase";
import { setDoc, doc } from "firebase/firestore";
import Lottie from "react-lottie";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import Register from "components/Register";
import ReadGongsa from "components/ReadGongsa";

const UserType = ({ userObj, userNum }) => {
  const [selectedItem, setSelectedItem] = useState("");

  const onChangeHandler = (e) => {
    setSelectedItem(e.currentTarget.value);
    console.log(selectedItem);
  };

  // let test = userNum.find((userNum) => {
  //   return userNum === gongsa;
  // });

  //submit 버튼 클릭 시 이벤트
  const submit = async (event) => {
    console.log("버튼눌림!");

    event.preventDefault();

    //게시글 삭제,수정을 위한 고유키 값 부여
    const key = userObj.uid;

    //DB저장 필드
    const Codeobj = {
      phone: userObj.displayName,
      type: selectedItem,
    };

    //key값 부여를 위한 addDoc에서 setDoc으로 함수 변경
    await setDoc(doc(dbService, "usertype", key), Codeobj);

    window.location.reload();
  };

  return (
    <div class="field has-addons">
      <div class="control is-expanded">
        <div class="select is-fullwidth">
          <select className="usertype" onChange={(e) => onChangeHandler(e)}>
            <option value="001">임직원</option>
            <option value="002">협력사</option>
            <option value="003">오거크레인/포크레인 기사</option>
          </select>
        </div>
      </div>
      <div class="control">
        <button className="button is-primary" type="submit" onClick={submit}>
          설정
        </button>
      </div>
    </div>
  );
};

export default UserType;
