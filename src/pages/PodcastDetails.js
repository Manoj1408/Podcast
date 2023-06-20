import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import { useNavigate, useParams } from "react-router-dom";
import { collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import Button from "../components/common/Button";
import EpisodeDetails from "../components/common/Podcasts/EpisodeDetails";
import AudioPlayer from "../components/common/Podcasts/AudioPlayer";

function PodcastDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [podcast, setPodcast] = useState({});
  const [episodes, setEpisodes] = useState([]);
  const [playingFile,setPlayingFile] = useState("");
  // console.log(id);

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);

  const getData = async () => {
    try {
      const podcastDoc = await getDoc(doc(db, "podcasts", id));
      if (podcastDoc.exists()) {
        console.log(podcastDoc.data());
        setPodcast({ id: id, ...podcastDoc.data() });
        
      } else {
        console.log("no Doc");
        toast.error("No such Podcast");
        navigate("/podcasts");
      }
    } catch (error) {
      console.error("Error fetching podcast:", error);
      toast.error(error.message);
    }
  };

   useEffect(() => {
     const unsubscribe = onSnapshot(
       query(collection(db, "podcasts", id, "episodes")),
       (querySnapshot) => {
         const episodesData = [];
         querySnapshot.forEach((doc) => {
           episodesData.push({ id: doc.id, ...doc.data() });
         });
         setEpisodes(episodesData);
       },
       (error) => {
         console.error("Error fetching episodes:", error);
       }
     );

     return () => {
       unsubscribe();
     };
   }, [id]);

  return (
    <div style={{marginBottom:"50px"}}>
      <Header />
      <div className="input-wrapper" style={{ marginTop: "0rem" }}>
        {podcast.id && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                margin: "1rem",
              }}
            >
              <h1 className="podcast-title-heading">{podcast.title}</h1>
              {podcast.createdBy == auth.currentUser.uid && (
                <Button
                  width={"200px"}
                  text={"Create Episode"}
                  onClick={() => {
                    navigate(`/podcast/${id}/create-episode`);
                  }}
                />
              )}
            </div>
            <div className="banner-wrapper">
              <img src={podcast.bannerImage} alt="" />
            </div>
            <p className="podcast-description">{podcast.description}</p>
            <h1 className="podcast-title-heading">Episodes</h1>
            {episodes.length > 0 ? (
              <>
                {episodes.map((episode, index) => {
                  return (
                    <EpisodeDetails
                      key={index}
                      index={index + 1}
                      title={episode.title}
                      description={episode.description}
                      audioFile={episode.audioFile}
                      onClick={(file) => setPlayingFile(file)}
                    />
                  );
                })}
              </>
            ) : (
              <p>No Episodes</p>
            )}
          </>
        )}
      </div>
      {playingFile && <AudioPlayer audioSrc={playingFile}  image={podcast.displayImage}/>}
    </div>
  );
}

export default PodcastDetailsPage;
