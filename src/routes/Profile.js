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

      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};

export default Profile;
