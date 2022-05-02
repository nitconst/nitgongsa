import React, { useState } from "react";
import { dbService } from "fbase";
import { collection, addDoc } from "firebase/firestore";
import Register from "components/Register";
import ReadGongsa from "components/ReadGongsa";

const Home = () => {
  return (
    <div>
      <Register />
      <ReadGongsa />
    </div>
  );
};

export default Home;
