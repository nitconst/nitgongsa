import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
import { dbService } from "fbase";
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

const UserType = ({ userObj, codeNum }) => {
  const [gongsa, setGongsa] = useState([]);
  const [isUser, setIsUser] = useState(false);

  return (
    <>
      <div>
        <div className="container">
          <div class="dropdown">
            <div class="dropdown-trigger">
              <button
                class="button"
                aria-haspopup="true"
                aria-controls="dropdown-menu"
              >
                <span>Dropdown button</span>
                <span class="icon is-small">
                  <i class="fas fa-angle-down" aria-hidden="true"></i>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserType;
