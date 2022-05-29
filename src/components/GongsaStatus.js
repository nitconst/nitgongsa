import React from "react";

const GongsaStatus = ({ gongsaObj }) => {
  switch (gongsaObj.code) {
    case 0:
      return <span className="tag is-warning">신고 중</span>;
    case 1:
      return <span className="tag is-light">처리 중</span>;
    case 2:
      return <span className="tag is-success">조치완료</span>;
    default:
      return <h4>그냥 로그인</h4>;
  }
};

export default GongsaStatus;
