import React, { useState } from "react";
import RegisterFactory from "./RegisterFactory";

const Register = ({ userObj }) => {
  const [isHiding, setIsHiding] = useState(false);
  // box 숨기기 toggle
  const toggleHide = () => {
    setIsHiding((prev) => !prev);
  };

  return (
    <div className="content">
      <div className="box">
        <div className="box-header" onClick={toggleHide}>
          <span className="icon">
            <i className="fas fa-plus is-large"></i>
          </span>
          <p className="box-header-text">공사정보 간편신고</p>
          <div className="div-arrow">
            <span className="icon">
              {isHiding ? (
                <>
                  <i className="fas fa-angle-down" />
                </>
              ) : (
                <>
                  <i className="fas fa-angle-right" />
                </>
              )}
            </span>
          </div>
        </div>
        {isHiding && <RegisterFactory userObj={userObj} />}
      </div>
    </div>
  );
};

export default Register;
