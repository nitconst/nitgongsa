import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
import mainAnimationData from "lotties/auth-construction.json";
import Employee from "lotties/69047-vacation.json";
import Partner from "lotties/95720-business-partners.json";

import axios from "axios";

const backUrl = process.env.REACT_APP_BACKEND_URL_USER;

const UserType = ({ userObj }) => {
  const [selectedItem, setSelectedItem] = useState("");

  const kt = {
    loop: true,
    autoplay: true,
    animationData: Employee,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const poclain = {
    loop: true,
    autoplay: true,
    animationData: mainAnimationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const Parters = {
    loop: true,
    autoplay: true,
    animationData: Partner,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  //submit 버튼 클릭 시 이벤트
  const onClick = (e) => {
    setSelectedItem(e.currentTarget.value);
    console.log(selectedItem);

    let a = e.currentTarget.name;
    let msg = a + "로 설정하시겠습니까?";
    if (window.confirm(msg)) {
      Submit(e);
    } else {
      console.log("메롱");
    }
  };

  const Submit = async (e) => {
    //게시글 삭제,수정을 위한 고유키 값 부여
    const key = userObj.uid;

    //DB저장 필드
    const Codeobj = {
      phone: userObj.displayName,
      type: e.currentTarget.value,
    };

    //key값 부여를 위한 addDoc에서 setDoc으로 함수 변경
    //await setDoc(doc(dbService, "usertype", key), Codeobj);

    await axios
      .put(backUrl, { key: key, phone: Codeobj.phone, type: Codeobj.type })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });

    window.location.reload();
  };

  return (
    <div className="tile is-ancenstor">
      <div className="tile is-vertical is-fullwidth ">
        <div class="tile is-parent">
          <p>
            <article class="tile is-child ">
              <Lottie options={kt} height={150} width={150} />
            </article>
          </p>
          <button
            className="button is-large is-fullwidth is-child notification is-primary"
            value="001"
            name="임직원"
            onClick={(e) => onClick(e)}
          >
            <p className="title">임직원</p>
          </button>
        </div>

        <div class="tile is-parent">
          <article class="tile is-child">
            <Lottie options={Parters} height={150} width={150} />
          </article>

          <button
            className="button is-large is-fullwidth is-child notification is-info"
            value="002"
            name="협력사"
            onClick={(e) => onClick(e)}
          >
            <p className="title">협력사</p>
          </button>
        </div>

        <div class="tile is-parent">
          <article class="tile is-child">
            <Lottie options={poclain} height={140} width={140} />
          </article>
          <button
            className="button is-large is-fullwidth is-child notification is-link"
            value="003"
            name="오거크레인/포크레인 기사"
            onClick={(e) => onClick(e)}
          >
            <p className="title">오거크레인/포크레인 기사</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserType;
