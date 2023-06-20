import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import { toast } from "react-toastify";
import InputComponent from "../common/Input";
import FIleInput from "../common/Input/FIleInput";
import { auth, db, storage } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function CreatePodcastForm() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [displayImage, setDisplayImage] = useState();
  const [bannerImage, setBannerImage] = useState();

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const displayImageHandle = (file) => {
    setDisplayImage(file);
  };
  const bannerImageHandle = (file) => {
    setBannerImage(file);
  };

  // const handleSubmit = () => {
  //   toast.success("podcast created");
  //   if (title && desc && displayImage && bannerImage) {
  //     //1. Upload files -> get downloadable links
  //     // 2. Create a new doc in a new collection caled podcasts
  //     // 3. Save this new podcast episodes states in our podcats
  //   } else {
  //     toast.error("Please Enter All values  ");
  //   }
  // };
  const handleSubmit = async () => {
    toast.success("podcast created");
    if (title && desc && displayImage && bannerImage) {
      setLoading(true);
      try {
        const bannerImageRef = ref(
          storage,
          `podcasts/${auth.currentUser.uid}/${Date.now()}`
        );
        await uploadBytes(bannerImageRef, bannerImage);

        const bannerImageUrl = await getDownloadURL(bannerImageRef);

        const displayImageRef = ref(
          storage,
          `podcasts/${auth.currentUser.uid}/${Date.now()}`
        );
        await uploadBytes(displayImageRef, displayImage);

        const displayImageURL = await getDownloadURL(displayImageRef);

        const podcastData = {
          title:title,
          description: desc,
          bannerImage: bannerImageUrl,
          displayImage: displayImageURL,
          createdBy: auth.currentUser.uid,
        };
        console.log(podcastData);
        const docRef = await addDoc(collection(db, "podcasts"), podcastData);

        // Redirect to the podcast details page
        navigate(`/podcast/${docRef.id}`);
        setTitle("");
        setDesc("");
        setBannerImage(null);
        setDisplayImage(null);
        toast.success("Podcast Created Successful!");
        setLoading(false);
      } catch (error) {
        console.error("Error creating podcast:", error);
        toast.error("Error creating podcast:", error.message);
        setLoading(false);
      }
    }
    else {
      toast.error("Please Enter All values  ");
     }
    
  };
  return (
    <div>
      <InputComponent
        state={title}
        setState={setTitle}
        placeholder="Title"
        type="text"
        required={true}
      />
      <InputComponent
        state={desc}
        setState={setDesc}
        placeholder="Description"
        type="text"
        required={true}
      />
      <FIleInput
        accept={"image/*"}
        id="display-image-input"
        fileHandleFnc={displayImageHandle}
        text={"Display Image Upload"}
      />

      <FIleInput
        accept={"image/*"}
        id="banner-image-input"
        fileHandleFnc={bannerImageHandle}
        text={"Banner Image Upload"}
      />
      <Button
        on
        text={loading ? "loading...." : "Create Podcast"}
        disabled={loading}
        onClick={handleSubmit}
      />
    </div>
  );
}

export default CreatePodcastForm;
