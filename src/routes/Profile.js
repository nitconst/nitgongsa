import React, { useState } from "react";
import { authService } from "fbase";

const Profile = ({ userObj }) => {
  console.log(userObj);
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onLogOutClick = async () => await authService.signOut();

  return (
    <div>
      <div>
        <label>{newDisplayName}</label>
      </div>

      <button onClick={onLogOutClick}>Log Out</button>
    </div>
  );
};

export default Profile;
