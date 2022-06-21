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
  return (
    <div>
      <div class="dropdown">
        <div class="dropdown-trigger">
          <button
            class="button"
            aria-haspopup="true"
            aria-controls="dropdown-menu3"
          >
            <span>Click me</span>
            <span class="icon is-small">
              <i class="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </button>
        </div>
        <div class="dropdown-menu" id="dropdown-menu3" role="menu">
          <div class="dropdown-content">
            <a href="#" class="dropdown-item">
              Overview
            </a>
            <a href="#" class="dropdown-item">
              Modifiers
            </a>
            <a href="#" class="dropdown-item">
              Grid
            </a>
            <a href="#" class="dropdown-item">
              Form
            </a>
            <a href="#" class="dropdown-item">
              Elements
            </a>
            <a href="#" class="dropdown-item">
              Components
            </a>
            <a href="#" class="dropdown-item">
              Layout
            </a>
            <a href="#" class="dropdown-item">
              More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserType;
