import React, { useState } from "react";
import RegisterFactory from "./RegisterFactory";

const Register = ({ userObj, codeNum }) => {
  const [isHiding, setIsHiding] = useState(false);
  // box 숨기기 toggle
  const toggleHide = () => {
    setIsHiding((prev) => !prev);
  };

  return (
    <div className="content">
      <div className="box">
        <div className="box-header">
          <span className="icon">
            <i className="fa-solid fa-pen is-large"></i>
          </span>
          <p className="box-header-text">공사정보 간편신고</p>
          <div className="div-arrow">
            <span className="icon">
              {isHiding ? (
                <>
                  <i className="fa-solid fa-angle-down" onClick={toggleHide} />
                </>
              ) : (
                <>
                  <i className="fa-solid fa-angle-right" onClick={toggleHide} />
                </>
              )}
            </span>
          </div>
        </div>
        {isHiding && <RegisterFactory userObj={userObj} codeNum={codeNum} />}
      </div>
    </div>
  );
};

export default Register;
