import React, { useState } from "react";
import InputComponent from "../../common/Input";
import Button from "../../common/Button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "../../../slices/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("login form...........");
    setLoading(true);
    if(email && password){
        try {
          // creating user/s account
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          const user = userCredential.user;
  
          
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = userDoc.data();
          console.log(userData);
          // save data into redux
          dispatch(
            setUser({
              name: userData.name,
              email: user.email,
              pImage:userData.pImage,
              uid: user.uid,
            })
          );
          toast.success("Login Successfull");
          setLoading(false);
          navigate("/profile");
        } catch (e) {
          console.log("error", e);
          setLoading(false);
          toast.error(e.message);
        }
    }else{
      toast.error("Make sure email and password are not empty");
      setLoading(false);
    }
    
  };
  return (
    <>
      <InputComponent
        state={email}
        setState={setEmail}
        placeholder="Email"
        type="text"
        required={true}
      />
      <InputComponent
        state={password}
        setState={setPassword}
        placeholder="Password"
        type="password"
        required={true}
      />

      <Button
        text={loading ? "Loading..." : "Login"}
        onClick={handleLogin}
        disabled={loading }
      />
    </>
  );
}

export default LoginForm;
