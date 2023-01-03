import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const backUrl = process.env.REACT_APP_BACKEND_URL;

const KakaoRedirectHandler = () => {
  let navigate = useNavigate();

  let params = new URL(document.location.toString()).searchParams;
  let code = params.get("code"); // 인가코드 받는 부분, code에 인가코드가 저장됨

  console.log(params);
  console.log(code);

  useEffect(async () => {
    // 백엔드에서 카카오로 토큰 요청을 진행할 수 있도록 하려면 인가코드만 백엔드로 전송

    await axios
      .post(`${backUrl}/users`, { params: { code: `${code}` } })
      .then((res) => {
        console.log(res);
        // 전송 성공했을 시 메인 화면으로 이동하며 기존 작업들 수행
        navigate("/");
      });
  }, []);

  return <div>이 화면이 왜 안보임?</div>;
};

export default KakaoRedirectHandler;
