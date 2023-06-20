import React, { useState } from "react";
import { useSelector } from "react-redux";
import Header from "../components/common/Header";
import Button from "../components/common/Button";
import { getAuth, signOut, updatePassword } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import Loader from "../components/common/Loader";
import profilepic from '../149071.png'
import InputComponent from "../components/common/Input";

function Profile() {
  const user = useSelector((state) => state.user.user);
  const [updatePassword1,setUpdatePassword1] = useState(false);
  const [newPassword,setNewPassword] = useState('');
  const [newConfirmPassword,setConfirmNewPassword] = useState('');
  console.log("my User", user);

  if (!user) {
    return <Loader />;
  }

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        toast.success("User Logged out");
      })
      .catch((error) => {
        // console.log(error);
        toast.error(error.message);
      });
  };

  const handleChangePassword = async () => {
    if(newPassword === newConfirmPassword && newPassword.length > 6){


// const user = auth.currentUser;
      const user = await auth.currentUser;
      console.log("hello",user);
      try {
        const userCredential = await updatePassword(user, newPassword);
        console.log("first")
        // console.log(userCredential.user)
        setUpdatePassword1(false);
        
      } catch (e) {
        console.log("error", e);
        toast.error(e.massage);
      }
    }else{
      if (newPassword != newConfirmPassword) {
        toast.error(
          "Please make Sure your password and confirm password matchs"
        );
      } else if (newPassword < 6) {
        toast.error("password length is less than 6");
      }
    }

  }
  return (
    <div>
      <Header />
      <div className="profile">
        <img src={user.pImage? user.pImage:profilepic } alt="" style={{height:'100px',width:'100px'}} />
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      
      {updatePassword1 && updatePassword1? (<>
        <InputComponent
        state={newPassword}
        setState={setNewPassword}
        placeholder="New Password"
        type="password"
        required={true}
      />
        <InputComponent
        state={newConfirmPassword}
        setState={setConfirmNewPassword}
        placeholder="New Confirm Password"
        type="password"
        required={true}
      />
      <Button text={"Update Password"} onClick={handleChangePassword } />
      </>) : (<Button text={"Change Password"} onClick={() =>setUpdatePassword1(!updatePassword1) } />)}
      <Button text={"Logout"} onClick={handleLogout} />
      </div>
      
    </div>
  );
}

export default Profile;
